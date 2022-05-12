from flask import Blueprint, request, jsonify
import json
import os
from flask_cors import cross_origin
import pandas as pd
from sqlalchemy import exc
import importlib


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
     
        rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
        rel_survey = db.session.query(Survey).filter_by(id=rel_questionnaire.survey_id).first()
        rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()
        rel_matchmaking_strategy = rel_survey.matchmaking_strategy
        rel_reclist_files = json.loads(rel_survey.reclist_filenames)
          ## new item selection strategies are stored in the src/matchmaking folder
        ## each file has a different name but contains a class called Strategy in it

        ## load the related strategy file (module) from the directory
        loaded_module = importlib.import_module(f'.{rel_matchmaking_strategy}', 'backend.src.strategies.matchmaking')
        #loaded_module = importlib.import_module(f'.{rel_strategy_name}', '..strategies.item_selection')
        ## load the Strategy class from the loaded module
        strategy_class_obj = getattr(loaded_module, 'Strategy')

        ## instantiate the loaded class with the dataset path in question
        strategy_class_instance = strategy_class_obj(rel_dataset.file_path)
        if strategy_class_instance:
            matched_offline_user_id = strategy_class_instance.perform_matchmaking()
            return send_recommendations(token, matched_offline_user_id, rel_reclist_files)

        return {'Error': 'Please check function send_recommendation of /recommendation route.'}


    elif request.method == "POST":

        ## recommendation post handles saving the ratings provided by participants for the individual
        ## reocmmendation lists that were shown

        ## token number, reclist num, rating provided by the frontend in POST data.
        data_from_frontend =request.get_json()
        reclist_filenames = data_from_frontend['reclist_filenames']
        offline_user_id = data_from_frontend['offline_user_id']
        ratings = data_from_frontend['ratings']
        token = data_from_frontend['token']

        if save_recom_ratings(token, offline_user_id, json.dumps(reclist_filenames), json.dumps(ratings)) == 0:
            return {'Success': 'Ratings saved successfully'}
        else:
            return {'Error:': 'Ratings could not be saved. Check save save_recom_ratings function in /recommendation route.'}
    else:
        return {'Error':'Request could not be handled by both GET and POST in /recommendation route.'}



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
        return 0
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        print(f'ERROR:\nfilename:recommendation.py\nfunction:save_recom_ratings\nerror:{e}')
        return -1