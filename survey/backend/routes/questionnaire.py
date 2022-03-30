from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models.survey import Survey
from ..database.models.questionnaire import Questionnaire

## createa a blueprint for this route to be easily added to root later.
questionnaire_bp = Blueprint('questionnaire', __name__)




@questionnaire_bp.route('/questionnaire', methods = ['POST', 'GET'])
def handle_questionnaire():
        '''
        the frontend first sends a get request to this route with a survey token which corresponds to a questionnaire
        first item is sent to the frontend when this get request is received
        
        '''


        if request.method == "GET":
            ## a get request on the questionnaire only comes asking for the first item
            ## it should deliver the first question and the total no. of questions
            ## so that the survey frontend can initialize.
            
            token_number = request.args.get('token')

            def send_initial_info():
                ## use the token to find the related survey
                ## use the survey-> dataset -> strategy to get the first item
                ## send it along with the total no. of items

                ##TODO: better way to do it? maybe move the first item request to the post request too.
                

                return "info"
            

            ## the first get 


            #send_question(token)

            
            ques = db.session.query(Questionnaire).filter_by(token=token_number).first()
            print(str(ques))
            sur= db.session.query(Survey).filter_by(id=ques.survey_id).first()
            all_surveys = db.session.query(Survey).all()
            for s in all_surveys:
                questions = db.session.query(Questionnaire).filter_by(survey_id=s.id)
                for q in questions:
                    print(f"surveyno: {s.id}, questionnaireno: {q.id}, token: {q.token}")

            
            all_ques = db.session.query(Questionnaire).filter_by(survey_id=ques.survey_id).all()
            print(f"--------------------------")
            for t in all_ques:
                print(str(t))

            ## load dataset first to be able to select first / next item
            ds = sur.load_dataset()
            ## get method signals that we send the welcome page and the very first item
            desc = ques.create_item_descritptions(ques.return_first_item(ds))#[demo_ids[question_number-1]])
            print(f"description = {desc}")
            return jsonify(desc)
        elif request.method == "POST":

            ## this route handles the ratings provided by the survey participant for each item
            ##incoming request contains a json in format {'token':'xyza8l8df',rating:{32:5.0}}

            def save_ratings():
                ## use token to find the survey participant id
                ## create a response object with survey participant id and info from the post body
                ## save to the db
                return "success or error message"
            
            def send_next_item():
                ## find all the responses by the participant till now
                ## use strategy to find next item
                ## send the item description to the frontend.
                return "JSON with the item description"




            ## save ratings and send next item
            '''def save_ratings():
                rec_json = json.loads(request.get_json())
                tok = (rec_json)['token']
                ratings = rec_json['ratings']


                ##fetch the questionnaire with the token received from the request
                ques = db.session.query(Questionnaire_Model).filter_by(token=tok).first()

                ##fetch the survey related to the questionnaire
                sur= db.session.query(Survey_Model).filter_by(id=ques.survey_id).first()

                ## load dataset from the survey dataset path
                ds = sur.load_dataset()
                ## get method signals that we send the welcome page and the very first item
                desc = ques.create_item_descritptions(ques.return_first_item(ds))#[demo_ids[question_number-1]])
                ##if request comes without any rating, it's the first request
                ## subsequent request will have ratings, thus also item numbers
                if ratings.keys():
                    last_key = list(ratings.keys())[-1]
                    print(f"last key{last_key}")

                    ## strategy for selecting next item is currently set to random
                    desc = ques.create_item_descritptions(ques.return_next_item(int(last_key),ds))#[demo_ids[question_number-1]])
                    #print(desc)
                    return jsonify(desc)
                else:
                    ## use the return first item strategy to select first item, currently set to random
                    desc = ques.create_item_descritptions(ques.return_first_item(ds))#[demo_ids[question_number-1]])
                    print("--------------")
                    print(desc)
                    return jsonify(desc)'''
        else:
            ## on rare occassions when the request does not correspond to eithre get or post
            return "error message"