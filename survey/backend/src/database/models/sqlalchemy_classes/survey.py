from ....app import db
import json
class Survey(db.Model):
    __tablename__ = 'survey'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(256), unique=True)
    num_items = db.Column(db.Integer())
    num_tokens = db.Column(db.Integer())
    description = db.Column(db.String(1024))
    matchmaking_strategy = db.Column(db.String(128))
    item_selection_strategy = db.Column(db.String(128))
    tokens = db.Column(db.String(4096))
    reclist_filenames = db.Column(db.String(1028))
    active_status = db.Column(db.String(32)) ## ["created", "started", "finished"]

    dataset_id = db.Column(db.Integer(), db.ForeignKey('dataset.id'))

    def __str__(self):
        return json.dumps({
            'id': self.id,
            'name': self.name,
            'num_items': self.num_items,
            'num_tokens': self.num_tokens,
            'description': self.description,
            'tokens': self.tokens,
            'dataset_id': self.dataset_id,
            'matchmaking_strategy': self.matchmaking_strategy,
            'item_selection_strategy': self.item_selection_strategy,
            'reclist_filenames': self.reclist_filenames,
            'active_status':self.active_status
        })