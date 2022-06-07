from pathlib import Path
import os

class Flask_Configs(object):
    CSRF_ENABLED= True
    SECRET_key= "lkjflkj899rfk++388999fhhu"
    CORS_HEADERS = 'Content-Type'
    SQLALCHEMY_DATABASE_URI= "sqlite:///"+"../data/survey_database.db" ## path is current_dir/database/test.db
    SQLALCHEMY_TRACK_MODIFICATIONS= False
    DEBUG=True
    
    MAIL_SERVER='smtp.gmail.com'
    MAIL_PORT=465
    MAIL_USE_SSL = True
    MAIL_USE_TLS = False
    MAIL_USERNAME='bloomsnruins@gmail.com'
    MAIL_PASSWORD= "dphckhbqghjnimuf"


    
