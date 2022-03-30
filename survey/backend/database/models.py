
import sys
import pandas as pd
from ..utils.utils import omdb_client
import os

from ..app import db


class Survey_Model(db.Model):
    __tablename__ = 'survey'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(256), unique=True)
    dataset_path = db.Column(db.String(256))
    description = db.Column(db.String(1024))




    def load_dataset(self):
        try:
            dataset = pd.read_csv(filepath_or_buffer= self.dataset_path, sep=',', dtype='str')
            return dataset
        except FileNotFoundError as e:
            print("file not found")
            return 
    def __str__(self):
        return f"id:{self.id}, name:{self.name}, num_items:{self.num_items}, num_token:{self.num_tokens}"





class Questionnaire_Model(db.Model):
    __tablename__ = 'questionnaire'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256))
    ratings = db.Column(db.String(1024))


    """
            strategy to select first element to present to the user (e.g. most popular, most rated, etc.)
    """
    def return_first_item(self, dataset):
        ## load the user item matrix
        ds = dataset#self.survey.load_dataset()
        ## randomly sample one of the rows
        item = ds.sample(axis="rows")
        #extract movie id from the row and convert the int64 value to python int value
        rand_movie_id_int = int(item['movieId'].values[0])
        #print(f" random movie without int: {rand_movie_id} and in int: {rand_movie_id_int}")
        return rand_movie_id_int

        
    def return_next_item(self, current_rating_profile, dataset):
        """ returns next item to be presented to the user based on the ratings
        provided by the user until this point

        Args:
            current_rating_profile: dict of item num : ratings until now
            {item_id: rating}
        """
        ds = dataset#self.survey.load_dataset()
        ## randomly sample one of the rows
        item = ds.sample(axis="rows")
        #extract movie id from the row and convert the int64 value to python int value
        rand_movie_id_int = int(item['movieId'].values[0])
        #print(f" random movie without int: {rand_movie_id} and in int: {rand_movie_id_int}")
        return rand_movie_id_int

    def create_item_descritptions(self,item_id):
        """ Provide description (id, description) for survey questionnaire items
            Change this function to suit your to create item descriptions
            frontend should be adapted to cater to the changes made here

        Args:
            item_id ([int]): ids of the items (from dataset)
        """
        try:
            item_labels_df = pd.read_csv('./datasets/movies.csv')
            #print(item_labels_df)
            imdb_id_links = pd.read_csv('./datasets/links.csv',dtype='str')
            ## build imdb ids from the imdb <-> omdb <-> movieId relationships extracted from links.csv
            
            imdb_id_int = imdb_id_links.loc[imdb_id_links['movieId'] == str(item_id)]['imdbId'].values[0]
            imdb_id = 'tt'+imdb_id_int


            ## send request to to the omdb api for detailled information for the given imdb id
            omdb_ans = omdb_client.imdbid(imdb_id, tomatoes=False)
            description = {
                'item_id': item_id,
                'description':{
                    'movie_id': item_id,
                    'imdb_id': imdb_id,
                    'title': omdb_ans['title'],
                    'year':omdb_ans['year'],
                    'genre': omdb_ans['genre'],
                    'director': omdb_ans['director'],
                    'writer': omdb_ans['writer'],
                    'actors': omdb_ans['actors'],
                    'plot': omdb_ans['plot'],
                    'poster': omdb_ans['poster']
                }


            }


            #  print(res)
            return description
        except FileNotFoundError as e:
            return e
    def __str__(self):
        return f"id: {self.id}\nsurvey_id: {self.survey_id}\ntoken: {self.token}\nratings: {self.ratings}"
        

""" class Token_Model(db.Model):
    __tablename__ = 'token'
    id = db.Column(db.Integer(), primary_key=True) """


class RecommendationList_Model(db.Model):
    __tablename__= 'reclist'
    id = db.Column(db.Integer(), primary_key=True)
    dataset_id = db.Column(db.Integer(), db.ForeignKey('dataset.id'))
    offline_eval_id = db.Column(db.Integer(), db.ForeignKey('ofline_eval.id'))
    offline_user_id = db.Column(db.Integer())
    recommendation_list = db.Column(db.String(1024))

    def __str__(self):
        return f"id: {self.id}\nsurvey_id: {self.survey_id}\noffline_user_id: {self.offline_user_id}\nrecommendation_list:\n{self.recommendation_list}"

class Questionnaire(db.Model):
    __tablename__ = 'questionnaire'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256), unique=True)
    num_questions = db.Column(db.Integer())
    __mapper_args__ ={
        'polymorphic_identity': 'questionnaire',
        'polymorphic_on': 'type'
    }
class Reclist_Questionnaire(Questionnaire):
    __mapper_args__={
        'polymorphic_identity': 'reclist_questionnaire'
    }



class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer(), primary_key=True)
    item_id = db.Column(db.Integer())
    questionnaire_id = db.Column(db.Integer(), db.ForeignKey('questionnaire.id'))

class Reclist_Question(db.Model):
    __tablename__='reclist_question'
    id = db.Column(db.Integer(), primary_key=True)
    reclist_id = db.Column(db.Integer(), db.ForeignKey('reclist.id'))
    reclist_questionnaire_id = db.Column(db.Integer(), db.ForeignKey('reclist_questionnaire.id'))

class Response(db.Model):
    __tablename__ = 'response'
    id = db.Column(db.Integer(), primary_key=True)
    item_id = db.Column(db.Integer())
    particpant_id = db.Colum(db.Integer(), db.ForeignKey('survey_participant.id'))
    rating = db.Column(db.Float())
    __mapper_args__ ={
        'polymorphic_identity': 'response',
        'polymorphic_on': 'type'
    }
class Reclist_Response(Response):
    reclist_id = db.Column(db.Integer(), db.ForeignKey('reclist.id'))
    __mapper_args__={
        'polymorphic_identity': 'reclist_response'
    }

class Survey_Participant(db.Model)
    __tablename__ = 'survey_participant'
    id = db.Column(db.Integer(), primary_key=True)
    survey_id = db.Column(db.Integer(), db.ForeignKey('survey.id'))
    token = db.Column(db.String(256))



class Dataset(db.Model):
    __tablename__= 'dataset'
    id = db.Column(db.Integer(), primary_key=True)
    file_path = db.Column(db.String(1024))
    num_users = db.Column(db.Integer())
    num_items = db.Column(db.Integer())

    def load_dataset(self):
        return "dataset"








    


