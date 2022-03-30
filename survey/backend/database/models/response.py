from ...app import db
class Response(db.Model):
    __tablename__ = 'response'
    id = db.Column(db.Integer(), primary_key=True)
    item_id = db.Column(db.Integer())
    particpant_id = db.Colum(db.Integer(), db.ForeignKey('survey_participant.id'))
    rating = db.Column(db.Float())
    __mapper_args__ ={
        'polymorphic_identity': 'response',
        'polymorphic_on': 'type'
    }
    