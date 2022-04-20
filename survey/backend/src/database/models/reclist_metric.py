from ...app import db
import json
class Reclist_Question(db.Model):
    __tablename__='reclist_metric'
    id = db.Column(db.Integer(), primary_key=True)
    description = db.Column(db.String(256))
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))


    ## concrete question related to the metric
    description = db.Column(db.String(1024))

    def __str__(self):
        return json.dumps({
            'id': self.id,
            'name': self.name,
            'reclist_id': self.description,
            'survey_id': self.survey_id
            
        })