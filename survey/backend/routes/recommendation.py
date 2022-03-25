from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models import Survey_Model, Questionnaire_Model

## createa a blueprint for this route to be easily added to root later.
recommendation_bp = Blueprint('recommendation', __name__)




@recommendation_bp.route('/recommendation', methods = ['POST', 'GET'])
def handle_recommendations():
    if request.method == "GET":
        ##placeholder for handling get request
        print("recommendation get")
        return "hello recommendations get"


    elif request.method == "POST":
        ## placeholder for handling post request.
        print("recommendation post")
        return "hello from recommendations post"

    
    else:
        return "An error has occured."
