import React, {useEffect, useState} from 'react';
import {FiUserCheck, FiUserX} from 'react-icons/fi';
import {Avatar} from '../pages/HomePage';
import {socket} from './Header';
import defaultAvatar from '../images/avatar.png';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {get_room} from '../actions/directPage';


export default function(props) {
    const [knownRooms, setKnownRooms] = useState([]);
    const [unknownRooms, setUnknownRooms] = useState([]);
    const [show, setShow] = useState(1);
    const {room_id} = useParams();
    const history = useHistory();
    useEffect(() => {
        socket.emit('get', {'token': localStorage.getItem('token')})
        socket.on('handle_room', data => {
            if (data.known_rooms && data.unknown_rooms) {
                setKnownRooms([...data.known_rooms]);
                setUnknownRooms([...data.unknown_rooms]);
            } else {
                alert('Something wrong! Try later');
            }
        });
        return () => {
            socket.off('handle_room');
        } 
    }, []);
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
        console.log(room_data);
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
            {props.data.map(room_data => (
                <button key={room_data.room_id} className='friend'
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
            {props.data.map(room_data => (
                <button key={room_data.room_id} className='friend'
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