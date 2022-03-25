from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models import Survey_Model, Questionnaire_Model

## createa a blueprint for this route to be easily added to root later.
survey_bp = Blueprint('survey', __name__)




@survey_bp.route('/survey', methods = ['POST', 'GET'])
def handle_survey():
    if request.method == "GET":
    ##placeholder for handling get request
        print("survey get")
        return "hello from survey get"


    elif request.method == "POST":
    ## placeholder for handling post request.
        print("survey post")
        return "hello from survey post"
    else:
        return "An error has occured."