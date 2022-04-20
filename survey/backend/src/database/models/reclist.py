from ...app import db
import json
class RecommendationList_Model(db.Model):
    __tablename__= 'reclist'
    id = db.Column(db.Integer(), primary_key=True)
    dataset_id = db.Column(db.Integer(), db.ForeignKey('dataset.id'))
    offline_eval_id = db.Column(db.Integer(), db.ForeignKey('offline_eval.id'))
    offline_user_id = db.Column(db.Integer())
    recommendation_list = db.Column(db.String(1024))

    def __str__(self):
        return json.dumps({
            'id':self.id,
            'dataset_id': self.dataset_id,
            'offline_eval_id': self.offline_eval_id,
            'recommendation_list': self.recommendation_list
        })