from flask import Flask
from flask_socketio import SocketIO, emit

server = Flask(__name__)
socketio = SocketIO(server, debug=True, cors_allowed_origins='*')

data = {
    "no_of_slots" : 10,
    "ava_slots" : 7,
    "slots_occ" : 3,
    "index_value" : [0, 0, 1, 1, 1, 1, 1, 0, 1, 1]
}

socketio.on('cctv1')
def cctv1():
    emit('server', data) 