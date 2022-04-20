from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models.questionnaire import Questionnaire
from ..database.models.survey import Survey
from ..database.models.dataset import Dataset
from ..utils.utils import create_item_descritptions


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

        def do_matchmaking():
            ## fetch all currently available ratings from the db for the token number
            ## perform matchmaking hoodoo
            ## return the recommendation lists as a list of lists equal to the no. of reclists to be shown
            return "all the reclists"
        return send_recommendations(token)


    elif request.method == "POST":

        ## recommendation post handles saving the ratings provided by participants for the individual
        ## reocmmendation lists that were shown

        ## token number, reclist num, rating provided by the frontend in POST data.
        

        def save_recom_ratings():
            ## tale the body of the post request.
            ## convert into reclist_rating object
            ## save to the db
            return "result of the operation"

        ## placeholder for handling post request.
        print("recommendation post")
        return "hello from recommendations post"

    
    else:
        return "An error has occured."


## creates item descriptions of the items
def send_recommendations(token):
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
    

    ## select a random item
    reclist = {}
    reclist['reclist_id'] = 42
    reclist_items = []

    for i in range(0,10):
        item = df.sample(axis="rows")
        rand_movie_id_int = int(item['movieId'].values[0])
        movie_desc = create_item_descritptions(rand_movie_id_int)
        reclist_items.append(movie_desc)
    reclist['items'] = reclist_items
    all_reclists.append(reclist)

    reclist2 = {}
    reclist2['reclist_id'] = 43
    reclist_items2 = []

    for i in range(0,10):
        item = df.sample(axis="rows")
        rand_movie_id_int = int(item['movieId'].values[0])
        movie_desc = create_item_descritptions(rand_movie_id_int)
        reclist_items2.append(movie_desc)
    reclist2['items'] = reclist_items2
    all_reclists.append(reclist2)
    print(all_reclists)
    return json.dumps(all_reclists)

