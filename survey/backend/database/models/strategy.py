from ...app import db
class Strategy(db.Model):
    __tablename__ = 'strategy'
    id = db.Column(db.Integer(), primary_key=True)
    current_ratings = db.Column(db.String(1024))
    dataset_id = db.Colum(db.Integer(), db.ForeignKey('dataset.id'))

    def get_first_item(self):
        return ''
    
    def get_last_item(self):
        return ''
    def perform_matchmaking(self):
        return ''