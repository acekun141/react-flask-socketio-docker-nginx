import React, {useEffect, useState} from 'react';
import {useLocation, Link} from 'react-router-dom';
import {FiSend, FiUsers} from 'react-icons/fi';


export default function Header() {
    const imageAddress = 'https://scontent.fhan5-1.fna.fbcdn.net/v/t1.0-9/69805046_991917030979058_4702335928889245696_n.jpg?_nc_cat=109&_nc_sid=09cbfe&_nc_ohc=TV3v6mvje3gAX-fkwtm&_nc_ht=scontent.fhan5-1.fna&oh=190e3139117785c37efcf1be98023ba7&oe=5EC02CD8'
    const location = useLocation();
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (location.pathname === '/login') {
            setShow(false);
        } else {
            setShow(true);
        }
    }, []);
    const result = show
        ? (
            <div className='header'>
                <div className='left-side'>
                    <p className='page-title'>
                        Unnamed
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
                        <img src={imageAddress} />
                    </div>
                </div>
            </div>
        )
        : null;
    return (
        result
    );
};
