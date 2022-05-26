
import os
from flask import Blueprint, request, jsonify
import json
from ..app import db
from sqlalchemy import exc
import importlib
import imp

from flask_cors import cross_origin
from ..database.models.sqlalchemy_classes.survey import Survey
from ..database.models.sqlalchemy_classes.questionnaire import Questionnaire
from ..database.models.sqlalchemy_classes.dataset import Dataset
from ..database.models.sqlalchemy_classes.participant import Survey_Participant
from ..database.models.sqlalchemy_classes.response import Response
from ..utils.utils import create_item_descritptions


from ..strategies.matchmaking.naive_matchmaking_strategy import Strategy
## createa a blueprint for this route to be easily added to root later.
questionnaire_bp = Blueprint('questionnaire', __name__)




@questionnaire_bp.route('/questionnaire', methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def handle_questionnaire():

    if request.method == "GET":
        token = request.args.get('token')
        print(f"token = {token}")
        survey_info = send_survey_details(token)
        return json.dumps(survey_info)
    
    elif request.method == "POST":

        ## this route handles the ratings provided by the survey participant for each item
        ## format of data from frontend
        ''' {
            'token': 'jdasfhkjh',
            'ratings': '{234: 5.0, 5739:3.5,..}'
            }
        '''
        ## get data from the body of the post request.
        post_json_data = json.loads(request.get_json()) ## questionnaire_response
        tok = (post_json_data)['token']
        ratings = post_json_data['ratings']

        #print(f"ratings from frontend : {ratings}")
        
        ## call helper function to save the rating provided by the frontend to the db
        save_ratings(tok, ratings)

        ## call helper function to provide (first) or next item
        next_item_and_ratings = send_next_item_and_current_ratings(tok)

        '''
            format of data sent to the frontend
            {
                current_ratings: {'126:'3.0', 48675: '1.0', '539':4.0 ..},
                'next_item': {
                    'item_id': 1625,
                    'description': {
                        'movie_id': 1625, 
                        'imdb_id': 'tt0119174', 
                        'title': 'The Game', 
                        'year': '1997', 
                        'genre': 'Drama, Mystery, Thriller', 
                        'director': 'David Fincher', 
                        'writer': 'John Brancato, Michael Ferris', 
                        'actors': 'Michael Douglas, Deborah Kara Unger, Sean Penn', 
                        'plot': 'After a wealthy San Francisco....', 
                        'poster': 'https://<poster URL>'}}

                }
            }
        '''
        #print(next_item_and_ratings)

        ## return the item description to the frontend
        return next_item_and_ratings
    else:
        ## on rare occassions when the request does not correspond to eithre get or post
        return "Error: Illegal request."













######################################################################################
##                              HELPER FUNCTIONS                                    ##
######################################################################################




## helper functions specific to the questionnaire route
## database should be configured (see app.py) and available as db for these to work

## when a post request arrives from the frontend, evaluate it and send
## next item employing the appropriate strategy

"""
    summary: evaluates the incoming request from the frontend to see if the
        request is for the first question or next question
        makes a decision for the first or next item based on current info
        creates description for the said item
        return the complete JSON of the item description
    
    paramters:
        participant_token: unique identifier of the participant, extracted from
        survey URL

        ques_no: current question number, -1 if it's start of the survey

"""

## provide the frontend necessary information about the related survey based
## on the participant token number
def send_survey_details(participant_token):
    rel_questionnaire = db.session.query(Questionnaire).filter_by(token=participant_token).first()
    num_items = rel_questionnaire.num_questions
    survey_name = db.session.query(Survey).filter_by(id=rel_questionnaire.survey_id).first().name
    participant_id = db.session.query(Survey_Participant).filter_by(token=participant_token).first().id
    curr_ratings = None
    prev_session_items = None
    try:
        curr_ratings =json.loads(db.session.query(Response).filter_by(participant_id=participant_id).first().ratings)
        #print(f"already rated items:{type(curr_ratings)}")
        #print(f"already rated items:{(curr_ratings)}")
    except AttributeError as e:
        print("no item rated yet")

    if curr_ratings:
        prev_session_items = [{
            'current_ratings': curr_ratings,
            'next_item': create_item_descritptions(i) 
            }for i in curr_ratings.keys()]
    
    payload_to_send = {
        'survey_name': survey_name,
        'num_items': num_items,
        'ratings': (curr_ratings),
        'previous_session_items': prev_session_items
    }
    return (payload_to_send)




## send description of the next item to be populated on the front end
## along with all current ratings of the user from the db
def send_next_item_and_current_ratings(participant_token):
    rel_participant = db.session.query(Survey_Participant).filter_by(token=participant_token).first()
    ## find out all current ratings given by the same user
    all_curr_ratings = db.session.query(Response).filter_by(participant_id = rel_participant.id).first().ratings


    ## traverse the db to related strategy using the token number
    rel_ques = db.session.query(Questionnaire).filter_by(token=participant_token).first()
    rel_survey = db.session.query(Survey).filter_by(id=rel_ques.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()
    rel_strategy_name = rel_survey.item_selection_strategy
    #print(f"strategy name = {rel_strategy_name}")



    ## new item selection strategies are stored in the src/matchmaking folder
    ## each file has a different name but contains a class called Strategy in it

    ## load the related strategy file (module) from the directory
    loaded_module = importlib.import_module(f'.{rel_strategy_name}', 'backend.src.strategies.item_selection')
    #loaded_module = importlib.import_module(f'.{rel_strategy_name}', '..strategies.item_selection')
    
    
    ## load the Strategy class from the loaded module
    strategy_class_obj = getattr(loaded_module, 'Strategy')

    ## instantiate the loaded class with the dataset path in question
    strategy_class_instance = strategy_class_obj(rel_dataset.file_path)
    if strategy_class_instance:
    ## if the question number shows it's first question asked
        next_item = create_item_descritptions(strategy_class_instance.get_next_item(all_curr_ratings))
        payload ={"current_ratings": json.loads(all_curr_ratings), "next_item": next_item}
        return payload
    
    return {'Error':'Eror in send_next_item_and_current_ratings in /questionnaire'}






"""
    summary: check if the item was already rated by the user
            if so update the appropriate Response object
            otherwise create a new response object and save it to the db
    parameters:
        participant_token: token number used by the participant to identify themselves
                            extracted from the URL the participant uses to log on to the survey
        ratings: rating data present as a JSON with format {itemid:rating}
"""
def save_ratings(particiapant_token, ratings):
    print(f'save ratings:\n current = {ratings.keys()}')
    

    partcipant = db.session.query(Survey_Participant).filter_by(token=particiapant_token).first()
        ## find if a response associated to the user and item exists yet
        ## response should be unique to the participant ID / Token
    resp = db.session.query(Response).filter_by(participant_id = partcipant.id).first()

    
    ## if no response related to the user and item yet create one and save in the db
    if not resp:
        response = Response(ratings=json.dumps(ratings), participant_id=partcipant.id)
        try:
            db.session.add(response)
            db.session.commit()
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error {e}")
    ## if the response object already exists, update the rating value only
    else:
        try:
            print("don't edit")
            curr_ratings = json.loads(resp.ratings)
            resp.ratings = json.dumps(curr_ratings | ratings)
            db.session.commit()
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error: {e}")
       # print(f"itemid = {itemid}\nrating: {rating}")
    #print(f"itmeid = part_id: {}\nitemid: {itemid}\nrating:{rating}")
    curr_ratings= db.session.query(Response).filter_by(participant_id=partcipant.id).all()
    for r in curr_ratings:
        print(str(r))
## src.strategies.matchmaking



def load_class_dynamically(module_name, relative_path_name, class_name):
    mod =  rel_strategy = importlib.import_module(f'.{module_name}', relative_path_name)
    class_object = getattr(mod, class_name)
    return class_object