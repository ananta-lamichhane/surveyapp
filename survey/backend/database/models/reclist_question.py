from ...app import db

class Reclist_Question(db.Model):
    __tablename__='reclist_question'
    id = db.Column(db.Integer(), primary_key=True)
    reclist_id = db.Column(db.Integer(), db.ForeignKey('reclist.id'))
    reclist_questionnaire_id = db.Column(db.Integer(), db.ForeignKey('reclist_questionnaire.id'))
