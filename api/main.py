from app import create_app, socketio, db

app = create_app(True)

if __name__ == '__main__':
    socketio.run(app, port=4321)
