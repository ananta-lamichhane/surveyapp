from tkinter import E
from flask import Blueprint, request, jsonify
import json
from ..app import db
import sqlalchemy.exc as exc

from ..utils.utils import generate_random_tokens

from ..database.models.survey import Survey
from ..database.models.questionnaire import Questionnaire

## createa a blueprint for this route to be easily added to root later.
survey_bp = Blueprint('survey', __name__)




@survey_bp.route('/survey', methods = ['POST', 'GET'])
def handle_survey():
    if request.method == "GET":

        ## the survey get method should deliver all relevant info to all the surveys
        ## which should then get populated into the dashboard

        def provide_survey_info():
            ## fetch all the info about all surveys
            ## convert it into a JSON 
            ## send it back to the frontend.
            ### TODO: think about if it makes sense to create dynamic routes e.g. /survey/<surveyid>
            return {'survey': 'info'}

        tokens = [generate_random_tokens(16) for n in range(0,10)]
       ## print(str(tokens))

        test_survey1 = Survey(name="testSurvey1", description="this is a test", tokens=json.dumps(tokens))
        try:
            db.session.add(test_survey1)
            db.session.commit()
        except exc.IntegrityError as e:
            db.session.rollback()
            print("survey with the id/name already exists")

        result_test = db.session.query(Survey).filter_by(name="testSurvey1").first()
        tokens_str = result_test.tokens
        print(f"tokens = {tokens_str}")
        tokens = json.loads(result_test.tokens)[0]
        print(tokens)

        print(f"survey name: {result_test.name}")



     #   return_survey( )

    ##placeholder for handling get request
        print("survey get")
        return "hello from survey get"


    elif request.method == "POST":

        def create_survey():
            ## get the info about the survey from the post request
            ## create a survey object and write it to the database

            surveyid = 42 ## placeholder for the id of the just created survey

            return surveyid
        def create_questionnaires(surveyid):
            ## take the surveyid just created
            ## use the tokens from the surveyid to create questionnaires with the tokens

            return ""
        
        def create_survey_participants(surveyid):
            ## similar to create_questionnaires, create survey participants associated with the survey ids

            return ""

        return "result of the survey creation process"
    else:
        return "An error has occured."