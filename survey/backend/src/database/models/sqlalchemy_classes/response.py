from ....app import db
import json
class Response(db.Model):
    __tablename__ = 'response'
    id = db.Column(db.Integer(), primary_key=True)
    participant_id = db.Column(db.Integer(), db.ForeignKey('survey_participant.id'))
    ratings = db.Column(db.String(256))

    def __str___(self):
        return json.dumps({
            'id': self.id,
            'particiapant_id': self.participant_id,
            'ratings': self.rating
        })
