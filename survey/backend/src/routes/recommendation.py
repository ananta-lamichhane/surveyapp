from flask import Blueprint, request, jsonify
import json
import os


from ..database.models.sqlalchemy_classes.reclist import RecommendationList_Model
from ..app import db
from ..database.models.sqlalchemy_classes.questionnaire import Questionnaire
from ..database.models.sqlalchemy_classes.survey import Survey
from ..database.models.sqlalchemy_classes.dataset import Dataset
from ..utils.utils import create_item_descritptions
from ..database.models.abstract_classes.machmaking import NaiveMatchmaking


## createa a blueprint for this route to be easily added to root later.
recommendation_bp = Blueprint('recommendation', __name__)





@recommendation_bp.route('/recommendation', methods = ['POST', 'GET'])
def handle_recommendations():

    if request.method == "GET":
        token = request.args.get("token")
        ## recommendation get is called when a particiapnt has finished answering the survey questions 
        ## i.e. item ratings and now its turn to show him/her the recommendations
        ## an answer to the get request should be all of the recommendation lists to be shown
        ## before sending the recommendatios, matchmaking is to be done using the data gathered from the participant
        
        ## find related dataset based on the token
        ## TODO: think of more elegant way to traverse to related dataset from token
        rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
        rel_survey = db.session.query(Survey).filter_by(id=rel_questionnaire.survey_id).first()
        rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()


        ## we need a dataset (file path) to instantiate the abstract base class matchmaking into NaiveMatchmaking
        dataset_path = rel_dataset.file_path
        matchmaking_strategy = NaiveMatchmaking(dataset_path)

        ## use the perform_matchmaking() function to find the user id of the matched offline user
        matched_offline_user_id = matchmaking_strategy.perform_matchmaking()
        #matched_offline_user_id = do_matchmaking()

        return send_recommendations(token, matched_offline_user_id)


    elif request.method == "POST":

        ## recommendation post handles saving the ratings provided by participants for the individual
        ## reocmmendation lists that were shown

        ## token number, reclist num, rating provided by the frontend in POST data.
        token = request.args.get("token")

        def save_recom_ratings():
            ## tale the body of the post request.
            ## convert into reclist_rating object
            ## save to the db
            return "result of the operation"


        ### hard coded offline user value for now.
        send_recommendations(token, 43)
        return "hello from recommendations post"

    
    else:
        return "An error has occured."




#######################################################################################
###                                 HELPER FUNCTIONS                                 ##
#######################################################################################


## creates item descriptions of the items
def send_recommendations(token, offline_user_id):
    rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
    rel_survey = db.session.query(Survey).filter_by(id = rel_questionnaire.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()

    df = rel_dataset.load_dataset()

    ###
    # placeholder for all recommendation lists
    '''
        recommendation lists format:
        
    '''
    all_reclists = []
    ## TODO: change this reclist needs to be specific to an user + algorithm + offline_eval (?)
    rel_reclist = db.session.query(RecommendationList_Model).filter_by(offline_user_id=offline_user_id).first()

    ## select a random item
    reclist_with_descriptions = {}
    reclist_with_descriptions['reclist_id'] = rel_reclist.id
    reclist_items = []

    
    for item in json.loads(rel_reclist.recommendation_list):
        movie_desc = create_item_descritptions(item)
        reclist_items.append(movie_desc)
    reclist_with_descriptions['items'] = reclist_items

    ## create two reclists with same items for demo purposes
    all_reclists.append(reclist_with_descriptions)
    all_reclists.append(reclist_with_descriptions)
    
    print(reclist_with_descriptions)
    return json.dumps(all_reclists)