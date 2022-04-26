from pathlib import Path
from tkinter import E
from flask import Blueprint, request, jsonify
import json
import os
from surprise import SVD, SVDpp, NMF, SlopeOne, KNNBaseline, KNNBasic, KNNWithMeans, KNNWithZScore, CoClustering, BaselineOnly, NormalPredictor
import sqlalchemy.exc as exc

from ..database.models.sqlalchemy_classes.algorithm import Algorithm
from ..app import db
from ..utils.utils import generate_random_tokens
from ..utils.utils import create_item_descritptions

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
def handle_survey():
    '''
        Survey get is called by the survey dashboard to get information not only about the surveys
        but also related datasets and offline evaluations.
        so all information is provied when this route is called
    '''
    if request.method == "GET":


        ## hard code a database, this will be handled later by offline_eval route.
        dataset_file_path = os.path.abspath('../data/datasets/movielens_small/ratings.csv')
        dataset_name = "movielensSmall"
        create_new_dataset(dataset_name, dataset_file_path)


        data_to_frontend = collect_frontend_dashboard_data()

        return data_to_frontend


    elif request.method == "POST":
        '''
            format of data from the frontend
            {
                'surveyName': 'survey1',
                'surveyDescription': 'this is a description',
                'surveyDataset': 'movielens',
                'surveyNumParticipants: 50,
                'surveyNumQuestions': 10
            }
        '''

        data_from_frontend = json.loads(request.get_json())
        print(data_from_frontend)
        survey_name = data_from_frontend['surveyName']
        survey_description = data_from_frontend['surveyDescription']
        dataset = data_from_frontend['surveyDataset']
        num_participants = int(data_from_frontend['surveyNumParticipants'])
        num_questions = int(data_from_frontend['surveyNumQuestions'])

        survey_creation_result = create_new_survey(survey_name, survey_description, dataset, num_participants, num_questions)
        
        ### format of the data sent to the frontend: string representation of the just created survey
        return (survey_creation_result)
    else:
        return "An error has occured."





######################################################################################
##                                  HELPER FUNCTIONS                                ##
######################################################################################

def collect_frontend_dashboard_data():
    all_data = {
                'surveys': [],
                'datasets': [],
                'offline_evals': [],
                'algorithms': []
                }
    ## list all surveys
    all_surveys = db.session.query(Survey).all()
    for s in all_surveys:
        ## add json formatted string representation of those surveys to the list
        all_data['surveys'].append(str(s))
    all_datasets = db.session.query(Dataset).all()

    ## ifo about all datasets
    for d in all_datasets:
        all_data['datasets'].append(str(d))
    
    ## info about all algorithms
    all_algorithms = db.session.query(Algorithm).all()
    for a in all_algorithms:
        all_data['algorithms'].append(str(a))
    return json.dumps(all_data)


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
        


def create_new_survey(name, description, dataset_name, num_participants, num_questions):
    ## the survey get method should deliver all relevant info to all the surveys from the
    ## frontend
    ## which should then get populated into the dashboard

    ## find out the related dataset
    res_dataset = db.session.query(Dataset).filter_by(name=dataset_name).first()

    ## random tokens
    tokens = [generate_random_tokens(16) for n in range(0,num_participants)]
    ## print(str(tokens))
    
    ## create survey with its database being the one created above
    test_survey1 = Survey(name=name, num_tokens=num_participants, dataset_id=res_dataset.id,description=description, tokens=json.dumps(tokens))
    try:
        db.session.add(test_survey1)
        db.session.commit()
    except exc.IntegrityError as e:
        db.session.rollback()
        print(e)
    
    ## find the survey created just now on the DB
    result_test = db.session.query(Survey).filter_by(name=name).first()

    ## create a questionnaire for every token
    for t in range(num_participants):
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






