

from ....app import db
class Reclist_Response(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    participant_id = db.Column(db.Integer(), db.ForeignKey('survey_participant.id'))
    ratings = db.Column(db.String(256))
    reclist_filenames = db.Column(db.String(1024)) ## in order that they were shown
    offline_user_id = db.Column(db.Integer())
    ## each recommendation list has to be rated based on various subjective metrics
    ## theese questions should be differentiable
    reclist_question_num = db.Column(db.Integer())