from itsdangerous import exc
from markupsafe import re
import pandas as pd

import os
import string
import random
import csv





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
