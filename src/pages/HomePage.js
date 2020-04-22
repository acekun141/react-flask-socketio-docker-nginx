import React, {useEffect, useState} from 'react';
import {get_facebook_friend} from '../actions/homePage';
import {useSelector} from 'react-redux';
import {
    FiSettings, FiMessageCircle,
    FiHeart, FiFacebook,
    FiUserMinus, FiUserPlus
} from 'react-icons/fi';

export default function HomePage() {
    return (
        <div className='module-homepage'>
            <div className='module-header'>
                <button className='favorite'>
                    <FiHeart size={20}/>
                    <p>Favorite</p>
                </button>
                <button className='facebook active'>
                    <FiFacebook size={20}/>
                    <p>Facebook</p>
                </button>
            </div>
            <div className='module-content'>
                <Facebook />
            </div>
        </div>
    );
};

export const Favorites = () => {
    const user = useSelector(state => state.user);
    return (
        <div className='favorites'>
            <div className='favorites-header'>
                <input type='text' placeholder='Find your friend' />
            </div>
            <div className='friend'>
                <div className='friend-avatar'>
                    <Avatar avatar={user.avatar}/>
                </div>
                <div className='friend-name'>
                    <p>Le Viet Hung</p>
                    <div className='group-button'>
                        <button className='message'>
                            <FiMessageCircle size={20} />
                            <p>Message</p>
                        </button>
                        <button className='unfavorite'>
                            <FiUserMinus size={20} />
                            <p>Unfavorite</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Facebook = () => {
    const token = useSelector(state => state.token);
    const [friends, setFriends] = useState([]); 
    const [next, setNext] = useState('');
    useEffect(() => {
        const async_function = async () => {
            const data = await get_facebook_friend(token);
            setFriends(data.friends.data);
            setNext(data.friends.paging.cursors.after);
        }
        if (token) {
            async_function();
        }
    }, [token])
    return (
        <div className='facebook'>
            {friends.map((friend) => (
                <div key={friend.id} className='friend'>
                    <div className='friend-avatar'>
                        <Avatar url={friend.picture.data.url}/>
                    </div>
                    <div className='friend-name'>
                        <p>{friend.name}</p>
                        <div className='group-button'>
                            <button className='message'>
                                <FiMessageCircle size={20} />
                                <p>Message</p>
                            </button>
                            <button className='favorite'>
                                <FiUserPlus size={20} />
                                <p>Favorite</p>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <div className='facebook-footer'>
                <button className='more'>More</button>
            </div>
        </div>
    );
}

export const Avatar = (props) => {
    return (
        <div className='avatar'>
            <img src={props.url} />
        </div>
    );
};