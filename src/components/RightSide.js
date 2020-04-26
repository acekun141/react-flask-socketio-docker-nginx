import React, {useState, useEffect} from 'react';
import {FiSend, FiChevronLeft} from 'react-icons/fi'
import {Avatar} from '../pages/HomePage';
import {useParams, Link} from 'react-router-dom';
import {FiMessageSquare} from 'react-icons/fi';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import defaultAvatar from '../images/avatar.png';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

export default function(props) {
    const {room_id} = useParams();
    const [next, setNext] = useState(false);
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const get_message = async (room_id, next) => {
        try {
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
                throw(new Error('error'));
            }
        } catch(error) {
            history.replace('/direct');
        }
    };
    const get_next_message = () => {
        get_message(room_id, next);
    }
    useEffect(() => {
        if (room_id) {
            get_message(room_id, 1);
        } else {
            setMessages([]);
        }
    }, [room_id]);
    return (
        room_id
        ? 
        <div className='right-side show'>
            <RoomInfo roomInfo={props.roomInfo}/>
            <MessageBox messages={messages} room_id={room_id} />
        </div>
        :
        <div className='right-side none-direct'>
            <FiMessageSquare size={60} />
            <p>Select your room</p>
        </div>
    );
};


const MessageBox = (props) => {
    const [messages, setMessages] = useState([]);
    const user = useSelector(state => state.user);
    const msgs = document.getElementById('messages');
    useEffect(() => {
        socket.on('send_message', (data) => {
            let date = new Date(data.date);
            setMessages([...messages, {
                user_id: data.user_id,
                message: data.message,
                id: data.id,
                date: `${date.getUTCHours()}:${date.getUTCMinutes()}`
            }]);
        });
        if (msgs) {
            setTimeout(() => {msgs.scrollTop = msgs.scrollHeight}, 1);
        }
        return () => {
            socket.off('send_mesasge');
        }
    }, [messages, msgs])
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
            if (msgs) {
                setTimeout(() => {msgs.scrollTop = msgs.scrollHeight}, 1);
            }
        }
    }, [props.messages, msgs])
    return (
        <div className='side-content'>
            <div className='messages' id='messages'>
                {messages.sort((a, b) => a.id - b.id).map(message => {
                    return (
                        <div key={message.id} className={`wrap-message ${user.userID === message.user_id ? 'your-message' : ''}`}>
                            <p className='message'>{message.message}</p>
                            <p className='time'>{message.date}</p>
                        </div>
                    )
                })}
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
            <Link to='/direct'>
                <FiChevronLeft size={32} className='back' />
            </Link>
            <Avatar url={roomInfo.user.avatar ? roomInfo.user.avatar : defaultAvatar} />
            <p className='title'>
                {roomInfo.user.name}
            </p>
        </div>
        : null
    );
};
