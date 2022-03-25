from itsdangerous import exc
from markupsafe import re
import pandas as pd
import omdb
import os
import string
import random



##iniitialize omdb api
## TODO: move sensitive information (api key) to a separate file
omdb_client = omdb.OMDBClient(apikey="afb2e202")



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

