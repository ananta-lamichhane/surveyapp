from flask import Blueprint, request, jsonify
import json

from ..database.models.dataset import Dataset
from ..app import db
import surprise
from surprise import SVD, SVDpp, NMF, SlopeOne, KNNBaseline, KNNBasic, KNNWithMeans, KNNWithZScore, CoClustering, BaselineOnly, NormalPredictor
import os


## createa a blueprint for this route to be easily added to root later.
offline_eval_bp = Blueprint('offline_eval', __name__)




@offline_eval_bp.route('/offline_eval', methods = ['POST', 'GET'])
def handle_offline_eval():
    if request.method == "GET":
    ##placeholder for handling get request


        create_recommendation_list(112, 'testds1', 'SVD', 10)
        
       # surprise.model_selection.cross_validate(surprise.BaselineOnly, data, verbose=True)

        
        return {"answer": "hello world"}

    elif request.method == "POST":
        ## extract parameters sent from the frontend and perform offline eval.
        ## create recommendation lists and save to the database.
        #perform_offline_eval()
    ## placeholder for handling post request.
        print("offline eval post")
        return "hello from offline eval post"


    else:
        return "An error has occured."



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
    fn = f"surprise.{algorithm}()"
    print(fn)
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
    print([int(pred.iid) for pred in preds])