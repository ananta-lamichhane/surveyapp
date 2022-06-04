from flask import Blueprint, request
import json
from flask_cors import cross_origin


from .helper_functions import collect_frontend_dashboard_data, create_item_descritptions, create_new_dataset, create_new_survey, start_stop_survey, send_email_to_user




## create a blueprint for this route to be easily added to root later.
survey_bp = Blueprint('survey', __name__)


'''

    The survey route handles all things related to the survey dashboard (e.g. displaying
    surveys, datasets and offline evaluations, creating new surveys, monitoring progress,etc.)


'''

@survey_bp.route('/survey', methods = ['POST', 'GET'])
@cross_origin(supports_credentials=True)
def handle_survey():
    '''
        Survey get is called by the survey dashboard to get information not only about the surveys
        but also related datasets and offline evaluations.
        so all information is provied when this route is called
    '''
    data_to_frontend = collect_frontend_dashboard_data()
    if request.method == "GET":
        #generate_random_reclists('../data/datasets/movielens_small/ratings.csv', '../data/recommendation_lists/random_reclist2.csv',10)
        if request.args:
            survey_id_for_action = int(request.args.get("surveyId"))
            action = request.args.get("action")
            start_stop_survey(survey_id_for_action, action)
        return data_to_frontend





        '''
            process the information sent from the survey creation form and create
            the database entries to initialize the survey
            format of data from the frontend
            {
                'surveyName': 'survey1',
                'surveyDescription': 'this is a description',
                'surveyDataset': 'movielens',
                'surveyNumParticipants: 50,
                'surveyNumQuestions': 10
            }
        '''
    elif request.method == "POST":


        data_from_frontend = json.loads(request.get_json())
        print(data_from_frontend)
        survey_name = data_from_frontend['surveyName']
        survey_description = data_from_frontend['surveyDescription']
        dataset = data_from_frontend['surveyDataset']
        num_participants = int(data_from_frontend['surveyNumParticipants'])
        num_questions = int(data_from_frontend['surveyNumQuestions'])
        item_selection_strategy = data_from_frontend['surveyItemSelectionStrategy']
        reclists_for_eval = data_from_frontend['onlineEvalReclists']
        matchmaking_strategy = data_from_frontend['surveyMatchmakingStrategy']
        mailing_list = data_from_frontend['surveyMailingList']
        

        survey_creation_result = create_new_survey(
        survey_name, 
        survey_description, 
        dataset,
        num_participants, 
        num_questions, 
        item_selection_strategy, 
        matchmaking_strategy,
        mailing_list,
        reclists_for_eval)
        ### format of the data sent to the frontend: string representation of the just created survey
        if survey_creation_result:
            return ({'OK':f'Succesfully created survey.\n Code {survey_creation_result}'})
        else:
            return ({'Error': 'Survey Creation Unsuccessful.'})
    else:
        return {'Error':'Could not be processed either GET or POST in route /survey'}



