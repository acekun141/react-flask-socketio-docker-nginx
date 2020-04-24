import React, {useEffect, useState} from 'react';
import {FiUserCheck, FiUserX} from 'react-icons/fi';
import {Avatar} from '../pages/HomePage';
import {socket} from './Header';
import defaultAvatar from '../images/avatar.png';
import {useHistory} from 'react-router-dom';


export default function(props) {
    const [knownRooms, setKnownRooms] = useState([]);
    const [unknownRooms, setUnknownRooms] = useState([]);
    const [show, setShow] = useState(1);
    const history = useHistory();
    useEffect(() => {
        socket.emit('get', {'token': localStorage.getItem('token')})
        socket.on('handle_room', data => {
            if (data.known_rooms && data.unknown_rooms) {
                setKnownRooms(data.known_rooms);
                setUnknownRooms(data.unknown_rooms);
            } else {
                alert('Something wrong! Try later');
            }
        });
        return () => {
            socket.off('handle_room');
        } 
    }, []);
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
        props.data.map(room_data => (
            <div key={room_data.room_id} className='wrap-list-friend'>
                <button className='friend'
                        onClick={() => props.enter(room_data)}
                >
                    <div className='friend-left'>
                        <Avatar url={defaultAvatar} />
                    </div>
                    <div className='friend-right'>
                        <p className='name'>{room_data.user.name}</p>
                    </div>
                </button>
            </div>
        ))
    );
}

const KnownRooms = (props) => {
    return (
        props.data.map(room_data => (
            <div key={room_data.room_id} className='wrap-list-friend'>
                <button className='friend'
                        onClick={() => props.enter(room_data)}
                >
                    <div className='friend-left'>
                        <Avatar url={room_data.user.avatar} />
                    </div>
                    <div className='friend-right'>
                        <p className='name'>{room_data.user.name}</p>
                    </div>
                </button>
            </div>
        ))
    );
}