from pathlib import Path
from tkinter import E
from flask import Blueprint, request, jsonify
import json
import os

from ..app import db
import sqlalchemy.exc as exc
import surprise
from surprise import SVD, SVDpp, NMF, SlopeOne, KNNBaseline, KNNBasic, KNNWithMeans, KNNWithZScore, CoClustering, BaselineOnly, NormalPredictor

from ..utils.utils import generate_random_tokens
from ..utils.utils import create_item_descritptions

from ..database.models.survey import Survey
from ..database.models.questionnaire import Questionnaire
from ..database.models.strategy import BaseStrategy, NaiveStrategy, SohphisticatedStrategy
from ..database.models.dataset import Dataset
from ..database.models.participant import Survey_Participant
from ..database.models.response import Response
from ..database.models.reclist_question import Reclist_Question
from ..database.models.reclist_questionnaire import Reclist_Questionnaire
from ..database.models.reclist_response import Reclist_Response

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
       # print(f"---------------------------{db.engine.table_names()}")

        ## create a mock survey to test the frontend
       # create_mock_survey()
       ## prepare data to be sent to the frontend
       ## this can be extended to send all kinds of data to the frontend
        all_data = {'surveys': [],
                    'datasets': [],
                    'offline_evals': []}
        ## list all surveys
        all_surveys = db.session.query(Survey).all()
        for s in all_surveys:
            ## add json formatted string representation of those surveys to the list
            all_data['surveys'].append(str(s))
        all_datasets = db.session.query(Dataset).all()
        for d in all_datasets:
            all_data['datasets'].append(str(d))
        ## TODO: do the same for offline evaluations

        print(json.dumps(all_data))

        return json.dumps(all_data)


    elif request.method == "POST":
        print("survey POST\n")
        data_from_frontend = json.loads(request.get_json())
       # name = data_from_frontend['name']
       # description = data_from_frontend['description']
       # dataset = data_from_frontend['dataset']
        
        print((data_from_frontend))
        algos_for_reclist = data_from_frontend['algorithms']
        reclist_length = data_from_frontend['reclistLength']
        for algo in algos_for_reclist:
             create_recommendation_list(112, 'testds1', algo, reclist_length)



    # return json.dumps(create_new_survey(name, description, dataset))
        json.dumps(request.get_json())
        def create_questionnaires(surveyid):
            ## take the surveyid just created
            ## use the tokens from the surveyid to create questionnaires with the tokens

            return ""
        
        def create_survey_participants(surveyid):
            ## similar to create_questionnaires, create survey participants associated with the survey ids

            return ""

        return (request.json)
    else:
        return "An error has occured."


def create_new_survey(name, description, dataset):
    path = os.path.abspath('../data/datasets/movielens_small/ratings.csv')
    print(f"path = {path}")

    ## the survey get method should deliver all relevant info to all the surveys
    ## which should then get populated into the dashboard

    ## first create dataset
    dataset1 = Dataset(name="testds1", file_path=path)
    try:
        db.session.add(dataset1)
        db.session.commit()
    except  :
        db.session.rollback()
        print(e)

    ## just created dataset, query to check
    res_dataset = db.session.query(Dataset).filter_by(name="testds1").first()

    ## random tokens
    tokens = [generate_random_tokens(16) for n in range(0,10)]
    ## print(str(tokens))
    
    ## create survey with its database being the one created above
    test_survey1 = Survey(name=name, dataset_id=res_dataset.id,description=description, tokens=json.dumps(tokens))
    try:
    
        db.session.add(test_survey1)
        db.session.commit()
    except exc.IntegrityError as e:
        db.session.rollback()
        print("survey with the id/name already exists")

    result_test = db.session.query(Survey).filter_by(name="testSurvey1").first()
    tokens_str = result_test.tokens
    print(f"tokens = {tokens_str}")
    tokens_0 = json.loads(result_test.tokens)[0]
    print(tokens_0)

    print(f"survey name: {result_test.name}")

    ## create a questionnaire for every token
    for t in tokens:
        ques1 = Questionnaire(survey_id=result_test.id, token=t, num_questions=10)
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

    
    ## create a strategy associated with the dataset
    strategy1 = NaiveStrategy(path)

    created_survey = db.session.query(Survey).filter_by(name=name).first()
    return(str(created_survey))

    print(create_item_descritptions(strategy1.get_next_item()))
    #   return_survey( )




## 
def create_mock_survey():
    path = os.path.abspath('../data/datasets/movielens_small/ratings.csv')
    print(f"path = {path}")

    ## the survey get method should deliver all relevant info to all the surveys
    ## which should then get populated into the dashboard

    ## first create dataset
    dataset1 = Dataset(name="testds1", file_path=path)
    try:
        db.session.add(dataset1)
        db.session.commit()
    except  :
        db.session.rollback()
        print(e)

    ## just created dataset, query to check
    res_dataset = db.session.query(Dataset).filter_by(name="testds1").first()

    ## random tokens
    tokens = [generate_random_tokens(16) for n in range(0,10)]
    ## print(str(tokens))
    
    ## create survey with its database being the one created above
    test_survey1 = Survey(name="testSurvey1", dataset_id=res_dataset.id,description="this is a test", tokens=json.dumps(tokens))
    try:
    
        db.session.add(test_survey1)
        db.session.commit()
    except exc.IntegrityError as e:
        db.session.rollback()
        print("survey with the id/name already exists")

    result_test = db.session.query(Survey).filter_by(name="testSurvey1").first()
    tokens_str = result_test.tokens
    print(f"tokens = {tokens_str}")
    tokens_0 = json.loads(result_test.tokens)[0]
    print(tokens_0)

    print(f"survey name: {result_test.name}")

    ## create a questionnaire for every token
    for t in tokens:
        ques1 = Questionnaire(survey_id=result_test.id, token=t, num_questions=10)
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

    
    ## create a strategy associated with the dataset
    strategy1 = NaiveStrategy(path)



    print(create_item_descritptions(strategy1.get_next_item()))
    #   return_survey( )




'''
    create a recommendation list of desired length and save it to the database
    available algorithms are the ones from the surprise library i.e.
    The reclist belongs to an offline-user (denoted by user_id)
    1. SVD (SVD)
    2. SVD++ (SVDpp)
    3. NMF(NMF)
    4. Slope One(SlopeOne)
    5. k-NNBasic(KNNBasic)
    6. Centered k-NN (?)
    7. Co-clustering (CoClustering)
    8. Baseline (BaselineOnly)
    9. KNN Baseline (KNNBaseline)
    10. Random (?)
    11. KNNWithMeans(KNNWithMeans)
    12. KNNWithZScore(KNNWithZScore)
'''


def create_recommendation_list(user_id,dataset, algorithm, reclist_length=10):
    dataset = db.session.query(Dataset).filter_by(name=dataset).first()
    fn = f"{algorithm}()"
    algo = eval(fn)
    dataset_path = dataset.file_path


    reader = surprise.Reader(line_format='user item rating timestamp', sep=',',skip_lines=1)

    data = surprise.Dataset.load_from_file(dataset_path, reader)
    trainset = data.build_full_trainset()
    algo.fit(trainset)
    preds = []
    for i in range(100):
        pred = algo.predict(str(user_id), str(i), r_ui=4, verbose=False)
        preds.append(pred)
    
    preds.sort(key= lambda x:x.est, reverse=True)
    print([{pred.iid:pred.est} for pred in preds])