from ...app import db

class RecommendationList_Model(db.Model):
    __tablename__= 'reclist'
    id = db.Column(db.Integer(), primary_key=True)
    dataset_id = db.Column(db.Integer(), db.ForeignKey('dataset.id'))
    offline_eval_id = db.Column(db.Integer(), db.ForeignKey('ofline_eval.id'))
    offline_user_id = db.Column(db.Integer())
    recommendation_list = db.Column(db.String(1024))

    def __str__(self):
        return f"id: {self.id}\nsurvey_id: {self.survey_id}\noffline_user_id: {self.offline_user_id}\nrecommendation_list:\n{self.recommendation_list}"