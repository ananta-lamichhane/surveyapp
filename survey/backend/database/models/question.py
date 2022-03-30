
from ...app import db

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer(), primary_key=True)
    item_id = db.Column(db.Integer())
    questionnaire_id = db.Column(db.Integer(), db.ForeignKey('questionnaire.id'))
