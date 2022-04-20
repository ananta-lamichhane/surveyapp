from ...app import db
import json
class Response(db.Model):
    __tablename__ = 'response'
    id = db.Column(db.Integer(), primary_key=True)
    item_id = db.Column(db.Integer())
    participant_id = db.Column(db.Integer(), db.ForeignKey('survey_participant.id'))
    rating = db.Column(db.Float())

    def __str___(self):
        return json.dumps({
            'id': self.id,
            'item_id': self.item_id,
            'particiapant_id': self.participant_id,
            'rating': self.rating
        })
