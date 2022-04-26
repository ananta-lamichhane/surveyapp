from ....app import db

from ..sqlalchemy_classes.dataset import Dataset
import pandas as pd
from abc import abstractmethod, ABC, ABCMeta
class MatchmakingBase(metaclass = ABCMeta):
    @abstractmethod 
    def __init__(self, path):
        self.__dataset_path = path


    @property
    @abstractmethod
    def dataset_path(self):
        pass


    @dataset_path.setter
    @abstractmethod
    def dataset_path(self, value):
        pass


    @abstractmethod
    def perform_matchmaking(self, dataset_path):
        pass


class NaiveMatchmaking(MatchmakingBase):
    def __init__(self, path):
        self.__dataset_path = path
    @property
    def dataset_path(self):
        return self.__dataset_path
    
    @dataset_path.setter
    def dataset_path(self, path):
        self.__dataset_path = path
    
    def perform_matchmaking(self):
        ## matchmaking logic here
        ## match with the random user in the db
        ## find out the related dataset by the given id
        dataset=""
        try:
            dataset = pd.read_csv(filepath_or_buffer= self.__dataset_path, sep=',', dtype='str')
        except FileNotFoundError as e:
            print("file not found")
            return e

        ## select a random item
        item = dataset.sample(axis="rows")

        ## send the movie id only
        rand_user_id_int = int(item['userId'].values[0])
        return rand_user_id_int
