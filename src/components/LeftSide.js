import React, {useEffect, useState} from 'react';
import {FiUserCheck, FiUserX} from 'react-icons/fi';
import {Avatar} from '../pages/HomePage';
import {socket} from './Header';
import defaultAvatar from '../images/avatar.svg';


export default function() {
    const [knownRooms, setKnownRooms] = useState([]);
    const [unknownRooms, setUnknownRooms] = useState([]);
    const [show, setShow] = useState(1);
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
                ? <KnownRooms data={knownRooms} />
                : null
            }
            {show === 2
                ? <UnknownRooms data={unknownRooms} />
                : null
            }
        </div>
    );
};

const UnknownRooms = (props) => {
    return (
        props.data.map(room_data => (
            <div key={room_data.room_id} className='wrap-list-friend'>
                <button className='friend'>
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
                <button className='friend'>
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