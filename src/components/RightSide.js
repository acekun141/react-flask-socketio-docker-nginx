import React, {useState, useEffect} from 'react';
import {FiSend} from 'react-icons/fi'
import {Avatar} from '../pages/HomePage';
import {useParams} from 'react-router-dom';
import {FiMessageSquare} from 'react-icons/fi';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import defaultAvatar from '../images/avatar.svg';
import {socket} from './Header';

export default function(props) {
    const {room_id} = useParams();
    const [next, setNext] = useState(1);
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const get_message = async (room_id, next) => {
        try {
            console.log(room_id, next);
            const response = await fetch('/chat/message', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'room_id': room_id,
                    'page': next
                },
            });
            const data = await response.json();
            if (data.messages) {
                setMessages([...data.messages]);
                if (data.next) {
                    setNext(data.next);
                } else {
                    setNext(false);
                }
            } else {
                throw('Error');
            }
        } catch(error) {
            history.replace('/direct');
        }
    };
    useEffect(() => {
        if (room_id) {
            setNext(1);
            get_message(room_id, next);
        }
    }, [room_id]);
    return (
        room_id
        ? 
        <div className='right-side'>
            <RoomInfo roomInfo={props.roomInfo}/>
            <MessageBox messages={messages} room_id={room_id} />
        </div>
        :
        <div className='none-direct'>
            <FiMessageSquare size={60} />
            <p>Select your room</p>
        </div>
    );
};


const MessageBox = (props) => {
    const [messages, setMessages] = useState([]);
    const user = useSelector(state => state.user);
    useEffect(() => {
        socket.on('send_message', (data) => {
            console.log(data.date);
            let date = new Date(data.date);
            setMessages([...messages, {
                user_id: data.user_id,
                message: data.message,
                id: data.id,
                date: `${date.getUTCHours()}:${date.getUTCMinutes()}`
            }]);
        });
        return () => {
            socket.off('send_mesasge');
        }
    }, [messages])
    useEffect(() => {
        if (props.messages) {
            setMessages(props.messages.map(message => {
                const date = new Date(message.date);
                return {user_id: message.user_id,
                        message: message.message,
                        id: message.id,
                        date: `${date.getUTCHours()}:${date.getUTCMinutes()}`
                    }
            }));
        }
    }, [props.messages])
    return (
        <div className='side-content'>
            <div className='messages'>
                {messages.sort((a, b) => a.id - b.id).map(message => (
                    <div key={message.id} className={`wrap-message ${user.userID === message.user_id ? 'your-message' : ''}`}>
                        <p className='message'>{message.message}</p>
                        <p className='time'>{message.date}</p>
                    </div>
                ))}
            </div>
            <SendMessage room_id={props.room_id} />
        </div>
    )
};

const SendMessage = (props) => {
    const [message, setMessage] = useState('');
    const handleChange = event => {
        setMessage(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (message)
            try {
                socket.emit('receive_message', {room_id: props.room_id, message: message, token: localStorage.getItem('token')});
            } catch(error) {
                alert('Something Wrong! Try later');
            }
            setMessage('');
        };
        return (
        <div className='typing'>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type='text'
                    placeholder='Message...'
                    value={message}
                    onChange={(e) => handleChange(e)}
                />
                <button type="submit">
                    <FiSend size={25}/>
                </button>
            </form>
        </div>
    );
}

const RoomInfo = (props) => {
    const [roomInfo, setRoomInfo] = useState({});
    useEffect(() => {
        setRoomInfo(props.roomInfo);
    }, [props.roomInfo])
    return (
        roomInfo.user ?
        <div className='side-header'>
            <Avatar url={roomInfo.user.avatar ? roomInfo.user.avatar : defaultAvatar} />
            <p className='title'>
                {roomInfo.user.name}
            </p>
        </div>
        : null
    );
};