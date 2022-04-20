from msilib.schema import Error
from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models.survey import Survey
from ..database.models.questionnaire import Questionnaire
from ..database.models.dataset import Dataset
from ..database.models.strategy import NaiveStrategy
from ..database.models.participant import Survey_Participant
from ..database.models.response import Response

from ..utils.utils import create_item_descritptions

## createa a blueprint for this route to be easily added to root later.
questionnaire_bp = Blueprint('questionnaire', __name__)




@questionnaire_bp.route('/questionnaire', methods = ['POST', 'GET'])
def handle_questionnaire():

        if request.method == "GET":
            token = request.args.get('token')
            survey_info = send_survey_details(token)
            print("welcome to questionnaire get")

            return json.dumps(survey_info)
        
        elif request.method == "POST":

            ## this route handles the ratings provided by the survey participant for each item
            ##incoming request contains a json in format {'token':'xyza8l8df',rating:{32:5.0}, ques_no:1}
            ''' {
                'token': 'jdasfhkjh',
                'next_question_no': 6, ()
                'rating': '{234: 5.0}'
             }'''
            ## get data from the body of the post request.
            post_json_data = json.loads(request.get_json()) ## questionnaire_response
            tok = (post_json_data)['token']
            ques_no = post_json_data['next_question_no']
            rating = post_json_data['ratings']
        	
            ## call helper function to save the rating provided by the frontend to the db
            save_ratings(tok, rating)

            ## call helper function to provide (first) or next item
            next_item = send_next_item(tok, ques_no)

            ## return the item description to the frontend
            return next_item
        else:
            ## on rare occassions when the request does not correspond to eithre get or post
            return "error message"





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
    return num_items





def send_next_item(participant_token, ques_no):
    rel_participant = db.session.query(Survey_Participant).filter_by(token=participant_token).first()


    ## find out all current ratings given by the same user
    all_curr_ratings = db.session.query(Response).filter_by(participant_id = rel_participant.id).all()

     ## traverse the db to related strategy using the token number
    rel_ques = db.session.query(Questionnaire).filter_by(token=participant_token).first()
    rel_survey = db.session.query(Survey).filter_by(id=rel_ques.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()
    rel_strategy = NaiveStrategy('../data/datasets/movielens_small/ratings.csv')
    
    ## if the question number shows it's first question asked

    return(create_item_descritptions(rel_strategy.get_next_item()))



"""
    summary: check if the item was already rated by the user
            if so update the appropriate Response object
            otherwise create a new response object and save it to the db
    parameters:
        participant_token: token number used by the participant to identify themselves
                            extracted from the URL the participant uses to log on to the survey
        data: rating data present as a JSON with format {itemid:rating}
"""
def save_ratings(particiapant_token, data):
    partcipant = db.session.query(Survey_Participant).filter_by(token=particiapant_token).first()
    if data != {}:
        ## data is a JSON of form {itemid:rating}
        itemid = list(data.keys())[0]
        rating = list(data.values())[0]
    	
        ## find if a response associated to the user and item exists yet
        resp = db.session.query(Response).filter_by(item_id = itemid, participant_id = partcipant.id).first()
        
        ## if no response related to the user and item yet create one and save in the db
        if not resp:
            response = Response(item_id = itemid, rating=rating, participant_id=partcipant.id)
            try:
                db.session.add(response)
                db.session.commit()
            except Error as e:
                db.session.rollback()
                print(f"Error {e}")
        ## if the response object already exists, update the rating value only
        else:
            try:
                resp.rating = rating
                db.session.commit()
            except Error as e:
                print(f"Error: {e}")
            print(f'item already exists : itemid= {resp.item_id}\n rating= {resp.rating}')
       # print(f"itemid = {itemid}\nrating: {rating}")
    #print(f"itmeid = part_id: {}\nitemid: {itemid}\nrating:{rating}")
