import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from flask import Blueprint
from flask_restplus import Api, Resource, reqparse

import json

from classes import Channel
from classes import Stream
from classes import RecordedVideo
from classes import topics

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'X-API-KEY'
    }
}

api_v1 = Blueprint('api', __name__, url_prefix='/api')
api = Api(api_v1, version='1.0', title='OSP API', description='OSP API for Users, Streamers, and Admins', authorizations=authorizations)

### Start API Functions ###

channelParserPut = reqparse.RequestParser()
channelParserPut.add_argument('channelName', type=str)
channelParserPut.add_argument('topicID', type=int)

channelParserPost = reqparse.RequestParser()
channelParserPost.add_argument('channelName', type=str, required=True)
channelParserPost.add_argument('topicID', type=int, required=True)

@api.route('/channels/')
class api_1_ListChannels(Resource):
    def get(self):
        channelList = Channel.Channel.query.all()
        return {'results': [ob.serialize() for ob in channelList]}
    # Channel - Create Channel
    @api.expect(channelParserPost)
    @api.doc(security='apikey')
    @api.doc(responses={200: 'Success', 400: 'Request Error'})
    def post(self):
        return {'results': {'message':'Channel Created'}}, 200

@api.route('/channels/<string:channelEndpointID>')
@api.doc(params={'channelEndpointID': 'Channel Endpoint Descriptor, Expressed in a UUID Value(ex:db0fe456-7823-40e2-b40e-31147882138e)'})
class api_1_ListChannel(Resource):
    def get(self, channelEndpointID):
        channelList = Channel.Channel.query.filter_by(channelLoc=channelEndpointID).all()
        return json.dumps({'results': [ob.serialize() for ob in channelList]})
    # Channel - Change Channel Name or Topic ID
    @api.expect(channelParserPut)
    @api.doc(security='apikey')
    @api.doc(responses={200: 'Success', 400: 'Request Error'})
    def put(self, channelEndpointID):
        channelQuery = Channel.Channel.query.filter_by(channelLoc=channelEndpointID).first()
        if channelQuery != None:
            if 'channelName' in channelParserPut:
                pass
            if 'topicID' in channelParserPut:
                pass
            return {'results': {'message':'Channel Updated'}}, 200
        else:
            return {'results': {'message':'Request Error'}}, 400

@api.route('/streams/')
class api_1_ListStreams(Resource):
    def get(self):
        streamList = Stream.Stream.query.all()
        return {'results': [ob.serialize() for ob in streamList]}

@api.route('/streams/<int:streamID>')
class api_1_ListStream(Resource):
    def get(self, streamID):
        streamList = Stream.Stream.query.filter_by(id=streamID).all()
        return {'results': [ob.serialize() for ob in streamList]}

@api.route('/vids/')
class api_1_ListVideos(Resource):
    def get(self):
        videoList = RecordedVideo.RecordedVideo.query.all()
        return {'results': [ob.serialize() for ob in videoList]}

@api.route('/vids/<int:videoID>')
class api_1_ListVideo(Resource):
    def get(self, videoID):
        videoList = RecordedVideo.RecordedVideo.query.filter_by(id=videoID).all()
        return {'results': [ob.serialize() for ob in videoList]}

@api.route('/topics/')
class api_1_ListTopics(Resource):
    def get(self):
        topicList = topics.topics.query.all()
        return {'results': [ob.serialize() for ob in topicList]}

@api.route('/topics/<int:topicID>')
@api.doc(params={'topicID': 'Topic ID Number'})
class api_1_ListTopic(Resource):
    def get(self, topicID):
        topicList = topics.topics.query.filter_by(id=topicID).all()
        return {'results': [ob.serialize() for ob in topicList]}
