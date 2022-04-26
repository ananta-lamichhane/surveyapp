from lib2to3.pgen2 import token
from ....app import db
import json
class Questionnaire(db.Model):
    __tablename__ = 'questionnaire'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256), unique=True)
    num_questions = db.Column(db.Integer())

    def __str__(self):
        return json.dumps(
            {
                'id': self.id,
                'survey_id': self.survey_id,
                'token': self.token,
                'num_questions': self.num_questions
                
            }
        )


