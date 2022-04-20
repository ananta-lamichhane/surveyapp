from ...app import db
import json
class Reclist_Question(db.Model):
    __tablename__='reclist_question'
    id = db.Column(db.Integer(), primary_key=True)
    reclist_id = db.Column(db.Integer(), db.ForeignKey('reclist.id'))
    reclist_questionnaire_id = db.Column(db.Integer(), db.ForeignKey('reclist_questionnaire.id'))

    def __str__(self):
        return json.dumps({
            'id': self.id,
            'reclist_id': self.reclist_id,
            'reclist_questionnaire_id': self.reclist_questionnaire_id
        })