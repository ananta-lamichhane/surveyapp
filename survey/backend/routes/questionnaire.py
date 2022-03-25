from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models import Survey_Model, Questionnaire_Model

## createa a blueprint for this route to be easily added to root later.
questionnaire_bp = Blueprint('questionnaire', __name__)




@questionnaire_bp.route('/questionnaire', methods = ['POST', 'GET'])
def handle_questionnaire():
        '''
        the frontend first sends a get request to this route with a survey token which corresponds to a questionnaire
        first item is sent to the frontend when this get request is received
        
        '''


        if request.method == "GET":
            ## print all tokens for test purpose
            
            token_number = request.args.get('token')
            ques = db.session.query(Questionnaire_Model).filter_by(token=token_number).first()
            print(str(ques))
            sur= db.session.query(Survey_Model).filter_by(id=ques.survey_id).first()
            all_surveys = db.session.query(Survey_Model).all()
            for s in all_surveys:
                questions = db.session.query(Questionnaire_Model).filter_by(survey_id=s.id)
                for q in questions:
                    print(f"surveyno: {s.id}, questionnaireno: {q.id}, token: {q.token}")

            
            all_ques = db.session.query(Questionnaire_Model).filter_by(survey_id=ques.survey_id).all()
            print(f"--------------------------")
            for t in all_ques:
                print(str(t))

            ## load dataset first to be able to select first / next item
            ds = sur.load_dataset()
            ## get method signals that we send the welcome page and the very first item
            desc = ques.create_item_descritptions(ques.return_first_item(ds))#[demo_ids[question_number-1]])
            print(f"description = {desc}")
            return jsonify(desc)
        if request.method == "POST":
            ##incoming request contains a json in format {'token':'xyza8l8df',ratings:{32:5.0,235:2.0,6329:3.0}}
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
                return jsonify(desc)