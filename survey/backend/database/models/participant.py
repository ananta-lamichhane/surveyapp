from ...app import db
class Survey_Participant(db.Model):
    __tablename__ = 'survey_participant'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256))

