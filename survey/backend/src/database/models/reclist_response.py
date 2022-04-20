

from ...app import db
class Reclist_Response(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    reclist_id = db.Column(db.Integer(), db.ForeignKey('reclist.id'))
    participant_id = db.Column(db.Integer(), db.ForeignKey('survey_participant.id'))
    rating = db.Column(db.Float())
    ## each recommendation list has to be rated based on various subjective metrics
    ## theese questions should be differentiable
    reclist_question_num = db.Column(db.Integer())