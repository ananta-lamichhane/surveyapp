from pathlib import Path
current_dir = str(Path.cwd()) ## findout current directory
class Flask_Configs(object):
    CSRF_ENABLED= True
    SECRET_key= "lkjflkj899rfk++388999fhhu"
    CORS_HEADERS = 'Content-Type'
    SQLALCHEMY_DATABASE_URI= "sqlite:///"+current_dir+"/database/test.db" ## path is current_dir/database/test.db
    SQLALCHEMY_TRACK_MODIFICATIONS= False

