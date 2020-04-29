import React, {useEffect, useState} from 'react';
import {FiUserCheck, FiUserX} from 'react-icons/fi';
import {Avatar} from '../pages/HomePage';
import defaultAvatar from '../images/avatar.png';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {get_room, get_all_room} from '../actions/directPage';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

export default function(props) {
    const [knownRooms, setKnownRooms] = useState([]);
    const [unknownRooms, setUnknownRooms] = useState([]);
    const [show, setShow] = useState(1);
    const {room_id} = useParams();
    const user = useSelector(state => state.user);
    const history = useHistory();
    useEffect(() => {
        const async_function = async () => {
            const data = await get_all_room();
            if (data) {
                setKnownRooms([...data.known_rooms]);
                setUnknownRooms([...data.unknown_rooms]);
            }
        };
        async_function();
        socket.emit('join', {room_id: user.userID, token: localStorage.getItem('token')})
        socket.on('take_new', (room_data) => {
            console.log(room_data);
            setKnownRooms(oldKnownRooms => {
                return oldKnownRooms.map(known_data => {
                    if (known_data.room_id === room_data.room_id) {
                        return room_data;
                    } else {
                        return known_data;
                    }
                });
            })    
            setUnknownRooms(oldUnknownRooms => {
                return oldUnknownRooms.map(unknown_data => {
                    if (unknown_data.room_id === room_data.room_id) {
                        return room_data;
                    } else {
                        return unknown_data;
                    }
                });
            })    
        })
        return () => {
            socket.off('take_new');
            socket.emit('leave', {room_id: user.userID, token: localStorage.getItem('token')});
        }
    }, [user]);
    useEffect(() => {
        const async_function = async () => {
            const data = await get_room(room_id);
            if (data, data.room_id, data.user) {
                props.setRoomInfo(data);
            }
        }
        if (room_id) {
            async_function();
        }
    }, [room_id]);
    const showKnown = () => {
        const known = document.getElementById('known');
        const unknown = document.getElementById('unknown');
        setShow(1);
        known.classList.add('active');
        unknown.classList.remove('active');
    };
    const showUnknown = () => {
        const known = document.getElementById('known');
        const unknown = document.getElementById('unknown');
        setShow(2)
        known.classList.remove('active');
        unknown.classList.add('active');
    };
    const enterRoom = (room_data) => {
        props.setRoomInfo(room_data);
        history.push(`/direct/${room_data.room_id}`);
    }
    return (
        <div className='left-side'>
            <div className='side-header'>
                <button id='known' className='choose friends active'
                        onClick={() => showKnown()}
                >
                    <FiUserCheck size={20} />
                    <p>Friends</p>
                </button>
                <button id='unknown' className='choose unknown'
                        onClick={() => showUnknown()}
                >
                    <FiUserX size={20} />
                    <p>Unknown</p>
                </button>
            </div>
            {show === 1
                ? <KnownRooms data={knownRooms} enter={enterRoom} />
                : null
            }
            {show === 2
                ? <UnknownRooms data={unknownRooms} enter={enterRoom} />
                : null
            }
        </div>
    );
};

const UnknownRooms = (props) => {
    return (
        <div className='wrap-list-friend'>
            {props.data
            .sort((a, b) => {
                const aDate = new Date(a.date);
                const bDate = new Date(b.date);
                if (aDate > bDate) {
                    return 1;
                } else if (aDate < bDate) {
                    return -1;
                } else {
                    return 0;
                }
            })
            .map(room_data => (
                <button key={room_data.room_id} className={`friend ${room_data.seen}`}
                        onClick={() => props.enter(room_data)}
                >
                    <div className='friend-left'>
                        <Avatar url={defaultAvatar} />
                    </div>
                    <div className='friend-right'>
                        <p className='name'>{room_data.user.name}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}

const KnownRooms = (props) => {
    return (
        <div className='wrap-list-friend'>
            {props.data
            .sort((a, b) => {
                const aDate = new Date(a.date);
                const bDate = new Date(b.date);
                if (aDate > bDate) {
                    return 1;
                } else if (aDate < bDate) {
                    return -1;
                } else {
                    return 0;
                }
            })
            .map(room_data => (
                <button key={room_data.room_id} className={`friend ${room_data.seen}`}
                        onClick={() => props.enter(room_data)}
                >
                    <div className='friend-left'>
                        <Avatar url={room_data.user.avatar} />
                    </div>
                    <div className='friend-right'>
                        <p className='name'>{room_data.user.name}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
