from pathlib import Path
import string
from flask import Blueprint, request, jsonify
import json
import os
from flask_cors import cross_origin
from surprise import SVD, SVDpp, NMF, SlopeOne, KNNBaseline, KNNBasic, KNNWithMeans, KNNWithZScore, CoClustering, BaselineOnly, NormalPredictor
import sqlalchemy.exc as exc
import pandas as pd

#from backend.src.database.models.sqlalchemy_classes.reclist import RecommendationList_Model

#from ..database.models.sqlalchemy_classes.algorithm import Algorithm
from ..app import db
from ..utils.utils import generate_random_tokens
from ..utils.utils import create_item_descritptions, generate_random_reclists,list_directory_files, list_subdirectoreis

from ..database.models.sqlalchemy_classes.survey import Survey
from ..database.models.sqlalchemy_classes.questionnaire import Questionnaire
from ..database.models.abstract_classes.strategy import BaseStrategy, NaiveStrategy, SohphisticatedStrategy
from ..database.models.sqlalchemy_classes.dataset import Dataset
from ..database.models.sqlalchemy_classes.participant import Survey_Participant
from ..database.models.sqlalchemy_classes.response import Response
from ..database.models.sqlalchemy_classes.reclist_question import Reclist_Question
from ..database.models.sqlalchemy_classes.reclist_questionnaire import Reclist_Questionnaire
from ..database.models.sqlalchemy_classes.reclist_response import Reclist_Response

## createa a blueprint for this route to be easily added to root later.
survey_bp = Blueprint('survey', __name__)


'''

    The survey route handles all things related to the survey dashboard (e.g. displaying
    surveys, datasets and offline evaluations, creating new surveys, monitoring progress,etc.)


'''

@survey_bp.route('/survey', methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def handle_survey():
    '''
        Survey get is called by the survey dashboard to get information not only about the surveys
        but also related datasets and offline evaluations.
        so all information is provied when this route is called
    '''
    if request.method == "GET":
        #generate_random_reclists('../data/datasets/movielens_small/ratings.csv', '../data/recommendation_lists/random_reclist2.csv',10)


        data_to_frontend = collect_frontend_dashboard_data()

        return data_to_frontend





        '''
            process the information sent from the survey creation form and create
            the database entries to initialize the survey
            format of data from the frontend
            {
                'surveyName': 'survey1',
                'surveyDescription': 'this is a description',
                'surveyDataset': 'movielens',
                'surveyNumParticipants: 50,
                'surveyNumQuestions': 10
            }
        '''
    elif request.method == "POST":


        data_from_frontend = json.loads(request.get_json())
        print(data_from_frontend)
        survey_name = data_from_frontend['surveyName']
        survey_description = data_from_frontend['surveyDescription']
        dataset = data_from_frontend['surveyDataset']
        num_participants = int(data_from_frontend['surveyNumParticipants'])
        num_questions = int(data_from_frontend['surveyNumQuestions'])
        item_selection_strategy = data_from_frontend['surveyItemSelectionStrategy']
        reclists_for_eval = data_from_frontend['onlineEvalReclists']
        matchmaking_strategy = data_from_frontend['surveyMatchmakingStrategy']
        
        
        survey_creation_result = create_new_survey(survey_name, survey_description, dataset, num_participants, num_questions, item_selection_strategy, matchmaking_strategy, reclists_for_eval)
        
        print()
        ### format of the data sent to the frontend: string representation of the just created survey
        return (survey_creation_result)
    else:
        return {'Error':'Could not be processed either GET or POST in route /survey'}





######################################################################################
##                                  HELPER FUNCTIONS                                ##
######################################################################################


''''
Collect the information about the surveys, datasets, offline evaluations, strategies, and more
to the frontend.

'''
def collect_frontend_dashboard_data():
    all_data = {
                'surveys': [],
                'datasets': [],
                'offline_evals': [],
                'reclists': [],
                'strategies':{
                    'matchmaking':[],
                    'item_selection':[]
                }
                }
    ## list all surveys
    all_surveys = db.session.query(Survey).all()
    if all_surveys:
        for s in all_surveys:
            ## add json formatted string representation of those surveys to the list
            all_data['surveys'].append(str(s))


    all_datasets_in_db = db.session.query(Dataset).all()
    dataset_dirs = list_subdirectoreis(('backend/data/datasets'))
    #dataset_dirs = list_subdirectoreis(os.path.abspath('../data/datasets'))
    if dataset_dirs:
        for d in dataset_dirs:
            create_new_dataset(d, f'{("backend/data/datasets")}/{d}/ratings.csv')
    if all_datasets_in_db:
        for  d1 in all_datasets_in_db:
            if d1.name not in dataset_dirs:
                try:
                    db.session.delete(d1)
                    db.session.commit()
                    print(f"deleted database {d1.name}")
                except exc.SQLAlchemyError as e:
                    db.session.rollback()
                    print(e)

    all_datasets = db.session.query(Dataset).all()

    ## get name of all reclist files from the directory
    #all_reclists = list_directory_files(os.path.abspath('../data/recommendation_lists'))
    all_reclists = list_directory_files(('backend/data/recommendation_lists'))
    for l in all_reclists:
        all_data['reclists'].append(l)
    ## ifo about all datasets
    if all_datasets:
        for d in all_datasets:
            all_data['datasets'].append(str(d))
    #all_matchmaking_strategies = list_directory_files('strategies/matchmaking')
    #all_item_selection_strategies = list_directory_files('strategies/item_selection')
    all_matchmaking_strategies = list_directory_files('backend/src/strategies/matchmaking')
    all_item_selection_strategies = list_directory_files('backend/src/strategies/item_selection')
    for s in all_matchmaking_strategies:
        all_data['strategies']['matchmaking'].append(s)
    for s in all_item_selection_strategies:
        all_data['strategies']['item_selection'].append(s)
    return json.dumps(all_data)








'''
    Take the file path of a dataset and add it to the database.
    NOTE: the actual database object is not saved, just the path is saved in the DB
    dataset.load_dataset() loads the said dataset from the file path as a pandas dataframe

'''
def create_new_dataset(name, file_path):
    ds_in_db = db.session.query(Dataset).filter_by(name=name).first()
    if ds_in_db:
        print(f"Dataset with the name already exists")
    else:
        ds = Dataset(name=name, file_path=file_path)
        try:
            db.session.add(ds)
            db.session.commit()
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            print(e)








'''
Create database objects initializing a survey
Also create specified number of survey questionnaire and participant objects
Create specified number of random strings to act as unique tokens and assign these
to the questionnaire and participant objects.

'''
def create_new_survey(name, description, dataset_name, num_participants, num_questions, item_selection_strategy, matchmaking_strategy, reclists_for_online_eval):
 

    ## find out the related dataset
    res_dataset = db.session.query(Dataset).filter_by(name=dataset_name).first()

    ## random tokens
    tokens = [generate_random_tokens(16) for n in range(0,num_participants)]
    ## print(str(tokens))
    
    ## create survey with its database being the one created above
    test_survey1 = Survey(name=name, num_tokens=num_participants, dataset_id=res_dataset.id,description=description, matchmaking_strategy=matchmaking_strategy, item_selection_strategy=item_selection_strategy, tokens=json.dumps(tokens), reclist_filenames=json.dumps(reclists_for_online_eval))
    try:
        db.session.add(test_survey1)
        db.session.commit()
    except exc.IntegrityError as e:
        db.session.rollback()
        print(e)
    
    ## find the survey created just now on the DB
    result_test = db.session.query(Survey).filter_by(name=name).first()

    ## create a questionnaire for every token
    for t in tokens:
        ques1 = Questionnaire(survey_id=result_test.id, token=t, num_questions=num_questions)
        try:
            db.session.add(ques1)
            db.session.commit()
        except:
            db.session.rollback()
            print(f"Error: {e}")
    
    ## create a participant for each token
    for t in tokens:
        participant = Survey_Participant(survey_id= result_test.id, token=t,)
        try:
            db.session.add(participant)
            db.session.commit()
        except:
            db.session.rollback()
            print(f"Error: {e}")


    created_survey = db.session.query(Survey).filter_by(name=name).first()
    return(str(created_survey))






