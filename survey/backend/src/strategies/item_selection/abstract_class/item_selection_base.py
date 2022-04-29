
import abc
import pandas as pd


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
