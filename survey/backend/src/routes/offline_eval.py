from flask import Blueprint, request, jsonify
import json
import sqlalchemy.exc as exc
from werkzeug.utils import secure_filename

import sqlalchemy

from ..database.models.sqlalchemy_classes.algorithm import Algorithm

from ..database.models.sqlalchemy_classes.dataset import Dataset
from ..database.models.sqlalchemy_classes.offline_eval import Offline_eval
from ..database.models.sqlalchemy_classes.reclist import RecommendationList_Model

from ..app import db
import surprise
from surprise import SVD, SVDpp, NMF, SlopeOne, KNNBaseline, KNNBasic, KNNWithMeans, KNNWithZScore, CoClustering, BaselineOnly, NormalPredictor
import os


## createa a blueprint for this route to be easily added to root later.
offline_eval_bp = Blueprint('offline_eval', __name__)




@offline_eval_bp.route('/offline_eval', methods = ['POST', 'GET'])
def handle_offline_eval():
    if request.method == "GET":
    ##placeholder for handling get reques

        all_reclists = db.session.query(RecommendationList_Model).all()
        for r in all_reclists:
            print("---")
            print(str(r))

        
        return {"answer": "hello world"}

    elif request.method == "POST":
        
        ## extract parameters sent from the frontend and perform offline eval.
        ## create recommendation lists and save to the database.
        #perform_offline_eval()
        filename = list(request.files.keys())[0]
        dataset_file = request.files[filename]
        save_dataset_file(dataset_file, ".i")
        print(request.args)
        #data_from_frontend = json.loads(request.get_json())
        #print(data_from_frontend)
        #eval_name = data_from_frontend['offlineEvalName']
        #algos_for_reclist = data_from_frontend['offlineEvalAlgorithms']
        #eval_metrics = data_from_frontend['offlineEvalMetrics']
        #eval_dataset = data_from_frontend['offlineEvalDataset']
        #reclist_length = int(data_from_frontend['reclistLength'])


        #for algo in algos_for_reclist:
           # create_and_save_algorith(algo, "placeholder")
           # algo_id = db.session.query(Algorithm).filter_by(name=algo).first().id
           # create_recommendation_lists(eval_dataset, algo_id,reclist_length)

        return {"hello": "hi"}


    else:
        return "An error has occured."







#######################################################################################
###                                    HELPER FUNCTIONS                             ###
#######################################################################################


'''
    create a recommendation list of desired length and save it to the database
    available algorithms are the ones from the surprise library i.e.
    The reclist belongs to an offline-user (denoted by user_id)
    1. SVD (SVD)
    2. SVD++ (SVDpp)
    3. NMF(NMF)
    4. Slope One(SlopeOne)
    5. k-NNBasic(KNNBasic)
    6. Co-clustering (CoClustering)
    7. Baseline (BaselineOnly)
    8. KNN Baseline (KNNBaseline)
    9. KNNWithMeans(KNNWithMeans)
    10. KNNWithZScore(KNNWithZScore)
'''
def save_dataset_file(file, path):
    file.save(secure_filename(file.filename))

def create_offline_eval(name, algorithms, metrics, dataset, reclist_length):
    return ""

def create_and_save_algorith(name, offline_evaluation_name):
    offline_eval_id = 1 ## TODO: Fix this after implementing create_offline_eval()

    db_algo = Algorithm(name=name, offline_eval_id=1)
    try:
        db.session.add(db_algo)
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session.rollback()
        print(e)
    created_algo = db.session.query(Algorithm).filter_by(name=name).first()

    return str(created_algo)




def create_recommendation_lists(dataset, algorithm_id,reclist_length=10):
    
    ##look for the databset with the given name in db, names are unique so only one result
    dataset = db.session.query(Dataset).filter_by(name=dataset).first()

    
    
    ## create a string of structure algorithm() to make compatible with surprise implementation
    algo_name = (db.session.query(Algorithm).filter_by(id=algorithm_id).first()).name
    fn = f"{algo_name}()"

    ## evaluaate the fn string as a function 
    algo = eval(fn)

    ## extract ds file path from db entry
    dataset_path = dataset.file_path
    dataset_df = dataset.load_dataset()
    users = dataset_df['userId'].unique()
    items = dataset_df['movieId'].unique()

    ## prepare for training and predicting using surprise library functions
    reader = surprise.Reader(line_format='user item rating timestamp', sep=',',skip_lines=1)

    data = surprise.Dataset.load_from_file(dataset_path, reader)

    ## use full dataset as trainset
    trainset = data.build_full_trainset()
    algo.fit(trainset)
    
    ## container for best predicted item ids
    preds = []
    for u in users:
        
        u_recs = []
        for i in items:
            pred = algo.predict(str(u), str(i), r_ui=4, verbose=False)
            u_recs.append(pred)
       # print(u_recs)
        u_recs.sort(key = lambda x:x.est, reverse=True)
        preds.append({'userId': u, 'reclist':[u.iid for u in u_recs[0:reclist_length-1]]})
        reclist = RecommendationList_Model(dataset_id=dataset.id, algorithm_id=algorithm_id, offline_user_id=u, recommendation_list = json.dumps([u.iid for u in u_recs[0:reclist_length-1]])  )
        try:
            db.session.add(reclist)
            db.session.commit()
        except exc.SQLAlchemyError as e:
            print(e)
            db.session.rollback()
        
    all_reclists = db.session.query(RecommendationList_Model).all()
    for r in all_reclists:
        print(str(r))
    
    ## sort the predictions based on the estimated ratings in descending order in place