from ....app import db

class Offline_eval(db.Model):
    __tablename__= 'offline_eval'
    id = db.Column(db.Integer(), primary_key=True)
    parameters = db.Column(db.String(1024))
    results = db.Column(db.String(1024))
    dataset_id = db.Column(db.Integer(), db.ForeignKey('dataset.id'))
    def create_recom_lists(self):

        ### create recommendation lists with random 10 items for test
        
        return 'recom lists'