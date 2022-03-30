from ...app import db

class Survey(db.Model):
    __tablename__ = 'survey'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(256), unique=True)
    num_items = db.Column(db.Integer())
    num_tokens = db.Column(db.Integer())
    description = db.Column(db.String(1024))
    tokens = db.Column(db.String(4096))