from ... app import db
import json
class Reclist_Questionnaire(db.Model):
    __tablename__ = 'reclist_questionnaire'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256), unique=True)
    num_questions = db.Column(db.Integer())

    def __str__(self):
        return json.dumps({
            'id': self.id,
            'survey_id': self.survey_id,
            'token': self.token,
            'num_questions': self.num_questions
        })