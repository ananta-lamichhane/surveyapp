from flask import Blueprint, request, jsonify
import json
from ..app import db

from ..database.models import Survey_Model, Questionnaire_Model

## createa a blueprint for this route to be easily added to root later.
offline_eval_bp = Blueprint('offline_eval', __name__)




@offline_eval_bp.route('/offline_eval', methods = ['POST', 'GET'])
def handle_offline_eval():
    if request.method == "GET":
    ##placeholder for handling get request
        print("offlien eval get")
        return "hello from offline eval get"


    elif request.method == "POST":
    ## placeholder for handling post request.
        print("offline eval post")
        return "hello from offline eval post"


    else:
        return "An error has occured."