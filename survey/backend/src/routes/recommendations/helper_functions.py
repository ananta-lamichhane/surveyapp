import json
import os
import pandas as pd
from sqlalchemy import exc
import csv


from ...utils.utils import create_item_descritptions
from ...app import db
from ...database.models.sqlalchemy_classes.dataset import Dataset
from ...database.models.sqlalchemy_classes.participant import Survey_Participant
from ...database.models.sqlalchemy_classes.reclist import RecommendationList_Model
from ...database.models.sqlalchemy_classes.reclist_response import Reclist_Response
from ...database.models.sqlalchemy_classes.survey import Survey
from ...database.models.sqlalchemy_classes.questionnaire import Questionnaire
from ...database.models.sqlalchemy_classes.response import Response



#######################################################################################
###                                 HELPER FUNCTIONS                                 ##
#######################################################################################


## creates item descriptions of the items
def send_recommendations(token, offline_user_id, reclist_files):
    rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
    rel_survey = db.session.query(Survey).filter_by(id = rel_questionnaire.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()
    rel_partcipant_id = db.session.query(Survey_Participant).filter_by(token=token).first().id
    rel_responses = db.session.query(Reclist_Response).filter_by(participant_id=rel_partcipant_id).first()
    print(f'offline user id = {offline_user_id}')
    payload = {
    }
    if rel_responses:
        print(str(rel_responses))
        payload['saved_session'] = str(rel_responses.ratings)
    else:
        payload['saved_session'] = {}
    payload['offline_user_id']= offline_user_id
    reclists = []
    for filename in reclist_files:
        df_filepath =os.path.abspath(f'backend/data/recommendation_lists/{filename}.csv')
        df = pd.read_csv(df_filepath,dtype='str')
        #df = pd.read_csv(f'../data/recommendation_lists/{filename}.csv')
        reclist_of_offline_userid  = df.loc[df['userId'] == str(offline_user_id+1)].iloc[:,1:].values.flatten().tolist()
        reclists.append({
                        'reclist_filename':filename,
                        'items': [create_item_descritptions(item) for item in reclist_of_offline_userid]
        })
    payload['reclists'] = reclists
    return json.dumps(payload)


def save_recom_ratings(token, offline_user_id, reclist_file_paths, ratings):
    rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
    rel_survey = db.session.query(Survey).filter_by(id = rel_questionnaire.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()
    rel_survey_participant = db.session.query(Survey_Participant).filter_by(token=token).first().id
    rel_response = db.session.query(Reclist_Response).filter_by(participant_id=rel_survey_participant).first()
    response = Reclist_Response(participant_id=rel_survey_participant, reclist_filenames=reclist_file_paths, offline_user_id=offline_user_id, ratings=ratings)
    if rel_response:
        print("response already there. not doing anything")
    else:
        try:
            db.session.add(response)
            db.session.commit()
            save_response_to_file(token)
            return 0
        except exc.SQLAlchemyError as e:
            db.session.rollback()
            print(f'ERROR:\nfilename:recommendation.py\nfunction:save_recom_ratings\nerror:{e}')
            return -1

def save_response_to_file(token):
    rel_questionnaire = db.session.query(Questionnaire).filter_by(token=token).first()
    rel_survey = db.session.query(Survey).filter_by(id = rel_questionnaire.survey_id).first()
    rel_dataset = db.session.query(Dataset).filter_by(id=rel_survey.dataset_id).first()
    rel_survey_participant = db.session.query(Survey_Participant).filter_by(token=token).first().id
    rel_reclist_response = db.session.query(Reclist_Response).filter_by(participant_id=rel_survey_participant).first()
    rel_items_response = db.session.query(Response).filter_by(participant_id=rel_survey_participant).first()


    survey_filepath = os.path.abspath(f'backend/data/results/online_eval/{rel_survey.name}.csv')
    with open(survey_filepath, 'a', newline='') as f:
        writer = csv.writer(f)

        if os.stat(survey_filepath).st_size == 0:
            print('File is empty')
            header = ['token','item_ratings','reclist_reponses']
            writer.writerow(header)
        data = [token,json.loads(rel_items_response.ratings),json.loads(rel_reclist_response.ratings)]
        writer.writerow(data)