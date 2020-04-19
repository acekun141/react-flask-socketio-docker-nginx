import React from 'react';
import {FiSettings, FiMessageCircle} from 'react-icons/fi';

export default function HomePage() {
    return (
        <div className='module-homepage'>
            <div className='module-header'>
                <input type='text' placeholder='Find your friend' />
            </div>
            <div className='module-content'>
                <div className='friend'>
                    <div className='friend-avatar'>
                        <Avatar />
                    </div>
                    <div className='friend-name'>
                        <p>Le Viet Hung</p>
                        <button className='message'>
                            <FiMessageCircle size={20} />
                            <p>Ping</p>
                        </button>
                    </div>
                </div>
                <div className='friend'>
                    <div className='friend-avatar'>
                        <Avatar />
                    </div>
                    <div className='friend-name'>
                        <p>Le Viet Hung</p>
                        <button className='message'>
                            <FiMessageCircle size={20} />
                            <p>Ping</p>
                        </button>
                    </div>
                </div>
                <div className='friend'>
                    <div className='friend-avatar'>
                        <Avatar />
                    </div>
                    <div className='friend-name'>
                        <p>Le Viet Hung</p>
                        <button className='message'>
                            <FiMessageCircle size={20} />
                            <p>Ping</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Avatar = () => {
    const link = 'https://scontent.fhan5-1.fna.fbcdn.net/v/t1.0-9/69805046_991917030979058_4702335928889245696_n.jpg?_nc_cat=109&_nc_sid=09cbfe&_nc_ohc=TV3v6mvje3gAX-fkwtm&_nc_ht=scontent.fhan5-1.fna&oh=190e3139117785c37efcf1be98023ba7&oe=5EC02CD8';
    return (
        <div className='avatar'>
            <img src={link} />
        </div>
    );
};
