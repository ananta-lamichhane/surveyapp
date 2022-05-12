from itsdangerous import exc
from markupsafe import re
import pandas as pd
import omdb
import os
import string
import random
import csv



##iniitialize omdb api
## TODO: move sensitive information (api key) to a separate file
omdb_client = omdb.OMDBClient(apikey="85798af") #afb2e202 aa5a8680



def generate_random_tokens(token_len):
    """Gemerate a random string of given length

    Args:
        token_len (int): desired length of random token string

    Returns:
        _type_(str): a token string of desired length
    """
    # all lowercase characters and numbers in ascii
    all_chars = string.ascii_lowercase + string.digits
    res = ''
    for i in range(token_len):
        c = random.choice(all_chars)
        res = res + random.choice(all_chars)
    return res

def create_item_descritptions(item_id):
    
    """ Provide description (id, description) for survey questionnaire items
        Change this function to suit your to create item descriptions
        frontend should be adapted to cater to the changes made here

    Args:
        item_id ([int]): ids of the items (from dataset)
    """
    try:
        movies_file_abspath = os.path.abspath("backend/data/datasets/movielens_small/movies.csv")
        #movies_file_abspath = os.path.abspath('../data/datasets/movielens_small/movies.csv')
        item_labels_df = pd.read_csv(movies_file_abspath, dtype='str')
        #print(item_labels_df)
        
        links_file_abspath = os.path.abspath("backend/data/datasets/movielens_small/links.csv")
        #links_file_abspath = os.path.abspath("../data/datasets/movielens_small/links.csv")
        imdb_id_links = pd.read_csv(links_file_abspath,dtype='str')
        ## build imdb ids from the imdb <-> omdb <-> movieId relationships extracted from links.csv
    
        imdb_id_int = imdb_id_links.loc[imdb_id_links['movieId'] == str(item_id)]['imdbId'].values[0]
        imdb_id = 'tt'+imdb_id_int


        ## send request to to the omdb api for detailled information for the given imdb id
        omdb_ans = omdb_client.imdbid(imdb_id)#, tomatoes=False)
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
        return f'ERROR: module: utils.create_item_descriptions, error:{e}'


def list_subdirectoreis(dir_path):
    directories = []
    for file in os.listdir(dir_path):
        d=os.path.join(dir_path, file)
        if os.path.isdir(d) and file != "__init__.py":
            directories.append(file)
    return directories


def list_directory_files(dir_path):
    files = []
    for file in os.listdir(dir_path):
        f=os.path.join(dir_path, file)
        if os.path.isfile(f) and file != '__init__.py':
            files.append(file.split('.')[0])
    return files


def generate_random_reclists(dataset_file_path, save_file_path, reclist_length):
    df = pd.read_csv(dataset_file_path,dtype='str')
    all_items = df['movieId'].unique().tolist()
    

    all_users = df['userId'].unique()


    with open(save_file_path, 'w') as f:
        write = csv.writer(f)
        index = ['userId']+ [f'item_{i+1}' for i in range(reclist_length)]
        write.writerow(index)
        for u in all_users:
            res = [u] + (random.choices(all_items, k=reclist_length))
            write.writerow(res)
            #print(res)
