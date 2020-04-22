import React, {useEffect, useState} from 'react';
import {useLocation, Link} from 'react-router-dom';
import {FiSend, FiUsers} from 'react-icons/fi';
import {useSelector} from 'react-redux';


export default function Header() {
    const location = useLocation();
    const user = useSelector(state => state.user);
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (location.pathname !== '/login' && user.name && user.avatar) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [location, user]);
    const result = show
        ? (
            <div className='header'>
                <div className='left-side'>
                    <p className='page-title'>
                        WHO
                    </p>
                </div>
                <div className='right-side'>
                    <div className='wrap-icon'>
                        <Link to='/'>
                            <FiUsers size={25} />
                        </Link>
                    </div>
                    <div className='wrap-icon'>
                        <Link to='direct'>
                            <div className='noti'>
                                <p>3</p>
                            </div>
                            <FiSend size={25} />
                        </Link>
                    </div>
                    <div className='user-icon wrap-icon'>
                        <img src={user.avatar} />
                    </div>
                </div>
            </div>
        )
        : null;
    return (
        result
    );
};
