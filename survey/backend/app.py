
from flask import Flask, jsonify, request
import json
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc
#from .utils.utils import generate_random_tokens
from .flask_configs import Flask_Configs



db = SQLAlchemy()
def create_app():

    app= Flask(__name__)

    ### Load app configurations from another file

    app.config.from_object(Flask_Configs)
    
    ##initialize database
    db.init_app(app)

    ##configure cors so that the react frontend can communicate with it.
    cors = CORS(app)
  #  from database.models import Survey_Model, Questionnaire_Model

    ## import the blueprints for individual routes from routes directory
    from .routes.questionnaire import questionnaire_bp
    #from .routes.offline_eval import offline_eval_bp
    #from .routes.recommendation import recommendation_bp
    from .routes.survey import survey_bp

    ## register blueprints so that they can be accessed as routes to the webapps
    app.register_blueprint(questionnaire_bp)
    app.register_blueprint(survey_bp)
    #app.register_blueprint(offline_eval_bp)
    #app.register_blueprint(recommendation_bp)

    ## create the actual tables in the db
    with app.app_context():
        db.create_all()


    return app


app = create_app()




## running the app on localhost and default port 5000.
if '__name__' == '__main__':
    app.run(debug=True)