from ...app import db
import abc
import pandas as pd
from .dataset import Dataset

## abstract SQLAlchemy Model class
## this class does not exist as table in db, only the instantiations do

class BaseStrategy(metaclass = abc.ABCMeta):
    @abc.abstractmethod
    def __init__(self, dataset_path):
        self.__dataset_path= dataset_path
            
    @property
    def dataset_path(self):
        pass


    @dataset_path.setter
    @abc.abstractmethod
    def dataset_path(self, value):
        pass


    @abc.abstractmethod
    def get_next_item(self):
        pass


## 

## instantiations of base strategy
## add new classes here for custom item selection strategies
class NaiveStrategy(BaseStrategy):
    def __init__(self, dataset_path):
        self.__dataset_path= dataset_path
            
    @property
    def dataset_path(self):
        return self.__database_path
    
    @dataset_path.setter
    def dataset_path(self, value):
        self.__dataset_path = value

    ## TODO: differentiate between first item and subsequent items case
    def get_next_item(self):
        dataset = ""
        try:
            dataset = pd.read_csv(filepath_or_buffer= self.__dataset_path, sep=',', dtype='str')
          
        except FileNotFoundError as e:
            print("file not found")
            return e

        ## select a random item
        item = dataset.sample(axis="rows")

        ## send the movie id only
        rand_movie_id_int = int(item['movieId'].values[0])
        return rand_movie_id_int


class SohphisticatedStrategy(BaseStrategy):
    
    def get_next_item(self, dataset_path):
        return 'last item sophesticated strat'