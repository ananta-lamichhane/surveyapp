from ....app import db
import json
class Algorithm(db.Model):
    __tablename__= 'algorithm'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(128))
    offline_eval_id = db.Column(db.Integer(), db.ForeignKey('offline_eval.id'))

    def __str__(self):
        return json.dumps({
            'id':self.id,
            'name': self.name,
            'offline_eval_id': self.offline_eval_id
        })