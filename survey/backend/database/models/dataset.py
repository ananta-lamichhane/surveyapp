import pandas as pd
from ...app import db
class Dataset(db.Model):
    __tablename__= 'dataset'
    id = db.Column(db.Integer(), primary_key=True)
    file_path = db.Column(db.String(1024))
    num_users = db.Column(db.Integer())
    num_items = db.Column(db.Integer())

    def load_dataset(self):
        try:
            dataset = pd.read_csv(filepath_or_buffer= self.dataset_path, sep=',', dtype='str')
            return dataset
        except FileNotFoundError as e:
            print("file not found")
            return e
    def __str__(self):
        return f"id:{self.id}, name:{self.name}, num_items:{self.num_items}, num_token:{self.num_tokens}"
