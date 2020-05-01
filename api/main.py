from app import create_app, socketio, db

app = create_app(True)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0",port=5000)
