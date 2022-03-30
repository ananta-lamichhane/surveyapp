from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models import Survey_Model, Questionnaire_Model

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

        def send_recommendations(reclists):
            ## use the reclists returned by do_matchmaking to create indiviudal item descriptions for each
            ## list and then send the information to the frontend.
            
            return "json with all itms and corresponding item descriptions"


        ##placeholder for handling get request
        print("recommendation get")
        return "hello recommendations get"


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
