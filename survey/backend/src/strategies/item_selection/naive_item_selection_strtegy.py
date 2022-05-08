import pandas as pd
from .abstract_class.item_selection_base import BaseStrategy
## instantiations of base strategy
## add new classes here for custom item selection strategies
class Strategy(BaseStrategy):
    def __init__(self, dataset_path):
        self.__dataset_path= dataset_path
            
    @property
    def dataset_path(self):
        return self.__database_path
    
    @dataset_path.setter
    def dataset_path(self, value):
        self.__dataset_path = value

    
    def get_next_item(self):
        dataset = ""
        try:
            dataset = pd.read_csv(filepath_or_buffer= self.__dataset_path, sep=',', dtype='str')
          
        except FileNotFoundError as e:
            print("ERROR:\nnaive_item_selection:file not found")
            return e

        ## select a random item
        item = dataset.sample(axis="rows")

        ## send the movie id only
        rand_movie_id_int = int(item['movieId'].values[0])
        return rand_movie_id_int


