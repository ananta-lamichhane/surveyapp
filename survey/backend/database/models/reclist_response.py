from survey.backend.database.models import Response
from .response import Response
from ...app import db
class Reclist_Response(Response):
    reclist_id = db.Column(db.Integer(), db.ForeignKey('reclist.id'))
    __mapper_args__={
        'polymorphic_identity': 'reclist_response'
    }
