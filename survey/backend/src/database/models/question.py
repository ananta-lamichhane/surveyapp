
from ...app import db
import json
class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer(), primary_key=True)
    item_id = db.Column(db.Integer())
    questionnaire_id = db.Column(db.Integer(), db.ForeignKey('questionnaire.id'))

    def __str__(self):
        return json.dumps({
            'id': self.id,
            'item_id': self.item_id,
            'questionnaire_id':self.questionnaire_id

        })