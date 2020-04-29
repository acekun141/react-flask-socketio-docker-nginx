import React, {useEffect, useState} from 'react';
import {useLocation, Link} from 'react-router-dom';
import {FiSend, FiUsers, FiLogOut, FiAlignJustify} from 'react-icons/fi';
import {useSelector, useDispatch} from 'react-redux';
import {log_out} from '../redux/reducer/user/actions';

export default function Header() {
    const dispatch = useDispatch();
    const location = useLocation();
    const user = useSelector(state => state.user);
    const [show, setShow] = useState(false);
    const [isShowOption, setIsShowOption] = useState(false)
    useEffect(() => {
        if (location.pathname !== '/login'
            && user.name && user.avatar) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [location, user]);
    const handleLogout = () => {
        setIsShowOption(false);
        dispatch(log_out());
    }
    const handleActive = (e) => {
        const header = document.getElementById('header');
        if (header.classList.value.includes('show')) {
            header.classList.remove('show');
        } else {
            header.classList.add('show');
        }
    }
    const result = show
        ? (
            <div className='header hide' id='header'>
                <div className='control-header'
                     onClick={(e) => handleActive(e)}
                >
                    <FiAlignJustify size={20} />
                </div>
                <div className='left-side'>
                    <p className='page-title'>
                        WHO
                    </p>
                </div>
                <div className='right-side'>
                    <FriendIcon />
                    <DirectIcon />
                    <div className='user-icon wrap-icon'
                         onClick={() => {
                             setIsShowOption(!isShowOption)
                         }}
                    >
                        <img src={user.avatar} />
                        <p>Account</p>
                        {isShowOption
                            ? (
                                <div className='user-options'>
                                    <div className='user-info'>
                                        <img src={user.avatar} />
                                        <p>{user.name}</p>
                                    </div>
                                    <button className='option'
                                            onClick={() => handleLogout()}
                                    >
                                        <FiLogOut size={20} />
                                        <p>Log out</p>
                                    </button>
                                </div>
                            )
                            : null
                        }
                    </div>
                </div>
            </div>
        )
        : null;
    return (
        result
    );
};

const FriendIcon = () => {
    const location = useLocation();
    useEffect(() => {
        const icon = document.getElementById('friend-header-icon');
        if (location.pathname === '/') {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    }, [location])
    return (
        <div className='wrap-icon' id='friend-header-icon'>
            <Link to='/'>
                <FiUsers size={25} />
                <p>Friends</p>
            </Link>
        </div>
    );
};


const DirectIcon = () => {
    const location = useLocation();
    useEffect(() => {
        const icon = document.getElementById('direct-header-icon');
        if (location.pathname.includes('direct')) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    }, [location])
    return (
        <div className='wrap-icon' id='direct-header-icon'>
            <Link to='/direct'>
                {/* <div className='noti'>
                    <p>3</p>
                </div> */}
                <FiSend size={25} />
                <p>Message</p>
            </Link>
        </div>
    );
};
