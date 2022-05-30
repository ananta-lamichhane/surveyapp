
import pandas as pd
from .abstract_class.machmaking_strategy_base import MatchmakingBase

class Strategy(MatchmakingBase):
    def __init__(self, path):
        self.__dataset_path = path
    @property
    def dataset_path(self):
        return self.__dataset_path
    
    @dataset_path.setter
    def dataset_path(self, path):
        self.__dataset_path = path
        self.__current_responses
    
    ## get_offline_user_id() <- change it to..
    def perform_matchmaking(self):
        ## matchmaking logic here
        ## match with the random user in the db
        ## find out the related dataset by the given id
        dataset=""
        try:
            dataset = pd.read_csv(filepath_or_buffer= self.__dataset_path, sep=';', dtype='str', encoding="ISO-8859-1")
        except FileNotFoundError as e:
            print("ERROR:\nnaive_mathmaking_strategy:file not found")
            return e

        ## select a random item
        item = dataset.sample(axis="rows")

        ## send the movie id only
        rand_user_id_int = int(item['User-ID'].values[0])
        return rand_user_id_int
