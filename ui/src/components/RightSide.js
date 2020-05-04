import React, {useState, useEffect, useCallback} from 'react';
import {FiSend, FiChevronLeft} from 'react-icons/fi'
import {Avatar} from '../pages/HomePage';
import {useParams, Link} from 'react-router-dom';
import {FiMessageSquare} from 'react-icons/fi';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {seen_room} from '../actions/directPage';
import soundEffect from '../sounds/message_sound.mp3';
import defaultAvatar from '../images/avatar.png';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');
const soundEff = new Audio(soundEffect);

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
    useEffect(() => {
        if (room_id) {
            get_message(room_id, 1);
            seen_room(room_id);
            socket.emit('join', {room_id, token: localStorage.getItem('token')});
        } else {
            setMessages([]);
        }
        return () => {
            socket.emit('leave', {room_id, token: localStorage.getItem('token')});
        }
    }, [room_id]);
    return (
        room_id
        ? 
        <div className='right-side show'>
            <RoomInfo roomInfo={props.roomInfo}/>
            <MessageBox messages={messages} room_id={room_id} next={next} setNext={setNext}/>
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
    const [len, setLen] = useState(0);
    const user = useSelector(state => state.user);
    const get_next_message = async () => {
        console.log(len);
        try {
            const response = await fetch('/chat/message', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    'room_id': props.room_id,
                    'page': props.next,
                    'len_new': len
                },
            });
            const data = await response.json();
            if (data.messages) {
                setMessages(oldMessages => [...oldMessages, ...data.messages]);
                if (data.next) {
                    props.setNext(data.next);
                } else {
                    props.setNext(false);
                }
            } else {
                throw(new Error('error'));
            }
        } catch(error) {
            alert('Something Wrong! Try later')
        }
    };
    useEffect(() => {
        socket.on('send_message', (data) => {
            setMessages(oldMessages => [...oldMessages, data]);
            setLen(oldLen => oldLen + 1);
            if (data.user_id !== user.userID) {
                soundEff.play();
            }
            seen_room(props.room_id);
        });
        return () => {
            socket.off('send_mesasge');
        }
    }, []);
    useEffect(() => {
        if (props.messages) {
            setMessages([...props.messages]);
        }
        return () => {
            setMessages([]);
        }
    }, [props.messages]);
    useEffect(() => {
        const msgs = document.getElementById('messages');
        if (msgs) {
            if (props.next === 2) {
                msgs.scrollTop = msgs.scrollHeight;
            }
            if (msgs.scrollTop !== 0) {
                msgs.scrollTop = msgs.scrollHeight;
            }
        }
    }, [messages, props.next])
    useEffect(() => {
        console.log(len);
    }, [len])
    return (
        <div className='side-content'>
            <div className='messages' id='messages'>
                {props.next
                    ? <button className='older-messages'
                              onClick={() => get_next_message()}>Older</button>
                    : null
                }
                {messages.sort((a, b) => a.id - b.id).map(message => {
                    const date = new Date(message.date);
                    const hour = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
                    const minus = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes();
                    return (
                        <div key={message.id} className={`wrap-message ${user.userID === message.user_id ? 'your-message' : ''}`}>
                            <p className='message'>{message.message}</p>
                            <p className='time'>{`${hour}:${minus}`}</p>
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
                socket.emit('receive_message',
                            {room_id: props.room_id,
                             message: message,
                             token: localStorage.getItem('token')});
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
