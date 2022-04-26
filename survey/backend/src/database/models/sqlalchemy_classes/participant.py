from ....app import db
import json
class Survey_Participant(db.Model):
    __tablename__ = 'survey_participant'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256))

    def __str__(self):
        return json.dumps({
            'id': self.id,
            'survey_id':self.survey_id,
            'token': self.token
        })


