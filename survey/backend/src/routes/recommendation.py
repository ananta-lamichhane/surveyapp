from flask import Blueprint, request, jsonify
import json
import os
from flask_cors import cross_origin
import pandas as pd
from sqlalchemy import exc


from ..database.models.sqlalchemy_classes.participant import Survey_Participant
from ..database.models.sqlalchemy_classes.reclist_response import Reclist_Response
from ..database.models.sqlalchemy_classes.reclist import RecommendationList_Model
from ..app import db
from ..database.models.sqlalchemy_classes.questionnaire import Questionnaire
from ..database.models.sqlalchemy_classes.survey import Survey
from ..database.models.sqlalchemy_classes.dataset import Dataset
from ..utils.utils import create_item_descritptions
from ..database.models.abstract_classes.machmaking import NaiveMatchmaking
from ..strategies.matchmaking.naive_matchmaking_strategy import Strategy

## createa a blueprint for this route to be easily added to root later.
recommendation_bp = Blueprint('recommendation', __name__)





@recommendation_bp.route('/recommendation', methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
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

        rel_reclist_files = json.loads(rel_survey.reclist_filenames)

        ## we need a dataset (file path) to instantiate the abstract base class matchmaking into NaiveMatchmaking
        


        ## use the perform_matchmaking() function to find the user id of the matched offline user
        #matchmaking_stretegy_name = rel_survey.matchmaking_stretegy
        
        ## temporary solution for strategy TODO
        #strategy = Strategy(os.path.abspath('../data/datasets/movielens_small/ratings.csv'))
        strategy = Strategy(os.path.abspath('backend/data/datasets/movielens_small/ratings.csv'))
        matched_offline_user_id = strategy.perform_matchmaking()
        print(f'matched offline user id = {matched_offline_user_id}')
        return send_recommendations(token, matched_offline_user_id, rel_reclist_files)


    elif request.method == "POST":

        ## recommendation post handles saving the ratings provided by participants for the individual
        ## reocmmendation lists that were shown

        ## token number, reclist num, rating provided by the frontend in POST data.
        data_from_frontend =request.get_json()
        reclist_filenames = data_from_frontend['reclist_filenames']
        offline_user_id = data_from_frontend['offline_user_id']
        ratings = data_from_frontend['ratings']
        token = data_from_frontend['token']

        save_recom_ratings(token, offline_user_id, json.dumps(reclist_filenames), json.dumps(ratings))

        ### hard coded offline user value for now.
        
        return {'message':'done'}

    
    else:
        return "An error has occured."



#######################################################################################
###                                 HELPER FUNCTIONS                                 ##
#######################################################################################


## creates item descriptions of the items
def send_recommendations(token, offline_user_id, reclist_files):
    rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
    rel_survey = db.session.query(Survey).filter_by(id = rel_questionnaire.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()

    payload = []
    for filename in reclist_files:
        df_filepath =os.path.abspath(f'backend/data/recommendation_lists/{filename}.csv')
        print(f'--------filepath-----\n{df_filepath}\n-----filepath---')
        df = pd.read_csv(df_filepath,dtype='str')
        #df = pd.read_csv(f'../data/recommendation_lists/{filename}.csv')
        reclist_of_offline_userid  = df.loc[df['userId'] == str(offline_user_id+1)].iloc[:,1:].values.flatten().tolist()
        payload.append({
                        'reclist_filename':filename,
                        'offline_user_id': offline_user_id,
                        'items': [create_item_descritptions(item) for item in reclist_of_offline_userid]
        })

    return json.dumps(payload)


def save_recom_ratings(token, offline_user_id, reclist_file_paths, ratings):
    rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
    rel_survey = db.session.query(Survey).filter_by(id = rel_questionnaire.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()
    rel_survey_participant = db.session.query(Survey_Participant).filter_by(token=token).first().id
    response = Reclist_Response(participant_id=rel_survey_participant, reclist_filenames=reclist_file_paths, offline_user_id=offline_user_id, ratings=ratings)
    try:
        db.session.add(response)
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        print(f'ERROR:\nfilename:recommendation.py\nfunction:save_recom_ratings\nerror:{e}')
    