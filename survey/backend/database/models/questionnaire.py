from ...app import db

class Questionnaire(db.Model):
    __tablename__ = 'questionnaire'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256), unique=True)
    num_questions = db.Column(db.Integer())
"""     __mapper_args__ ={
        'polymorphic_identity': 'questionnaire',
        'polymorphic_on': type
    } """