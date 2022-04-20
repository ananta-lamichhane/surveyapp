from ...app import db
import abc
from .dataset import Dataset
import pandas as pd
class MatchmakingBase(abc.ABC):

    @property
    @abc.abstractmethod
    def dataset_path(self):
        pass


    @dataset_path.setter
    @abc.abstractclassmethod
    def path(self, value):
        pass


    @abc.abstractmethod
    def perform_matchmaking(self, dataset_path):
        pass


class NaiveMatchmaking(MatchmakingBase):

    @property
    def dataset_path(self):
        return self._dataset_path
    
    @dataset_path.setter
    def dataset_path(self, value):
        self._dataset_path = value
    
    def perform_matchmaking(self, dataset_path):
        ## matchmaking logic here
        ## match with the random user in the db
        ## find out the related dataset by the given id
        dataset=""
        try:
            dataset = pd.read_csv(filepath_or_buffer= self._dataset_path, sep=',', dtype='str')
        except FileNotFoundError as e:
            print("file not found")
            return e

        ## select a random item
        item = dataset.sample(axis="rows")

        ## send the movie id only
        rand_movie_id_int = int(item['movieId'].values[0])
        return rand_movie_id_int
