import React, {useEffect, useState} from 'react';
import {get_facebook_friend, get_next_friend} from '../actions/homePage';
import {
    get_favorites,
    add_favorite,
    remove_favorite
} from '../redux/reducer/favorites/actions';
import {useSelector, useDispatch} from 'react-redux';
import Loading from '../components/Loading';
import {
    FiSettings, FiMessageCircle,
    FiHeart, FiFacebook,
    FiUserMinus, FiUserPlus,
    FiUser
} from 'react-icons/fi';

export default function HomePage() {
    const [show, setShow] = useState('favorites');
    const handleClick = (name) => {
        setShow(name);
    }
    return (
        <div className='module-homepage'>
            <div className='module-header'>
                <button className={`favorite ${show === 'favorites' ? 'active' : null}`}
                        onClick={() => handleClick('favorites')}
                >
                    <FiHeart size={20}/>
                    <p>Favorite</p>
                </button>
                <button className={`facebook ${show === 'facebook' ? 'active' : null}`}
                        onClick={() => handleClick('facebook')}
                >
                    <FiFacebook size={20}/>
                    <p>Facebook</p>
                </button>
            </div>
            <div className='module-content'>
                {show === 'favorites'
                    ? <Favorites /> 
                    : null
                }
                {show === 'facebook'
                    ? <Facebook /> 
                    : null
                }
            </div>
        </div>
    );
};

export const Favorites = () => {
    const favorites = useSelector(state => state.favorites)
    const dispatch = useDispatch();
    const [isFetch, setIsFetch] = useState(false);
    const [search, setSearch] = useState('');
    useEffect(() => {
        setIsFetch(true)
        dispatch(get_favorites());
        setIsFetch(false)
    }, []);
    const handleClick = (user_id) => {
        dispatch(remove_favorite(user_id));
    }
    const handleChange = (e) => {
        setSearch(e.target.value);
    }
    return (
        isFetch
        ? <Loading />
        :
        <div className='favorites'>
            {favorites.length
                ? (
                    <div className='favorites-header'>
                        <input type='text'
                               placeholder='Find your friend'
                               value={search}
                               onChange={(e) => handleChange(e)}
                        />
                    </div>
                )
                : <NoneResult />
            }
            {favorites
            .filter(favorite => favorite.name.includes(search))
            .map(favorite => (
                <div key={favorite.userID} className='friend'>
                    <div className='friend-avatar'>
                        <Avatar url={favorite.avatar}/>
                    </div>
                    <div className='friend-name'>
                        <p>{favorite.name}</p>
                        <div className='group-button'>
                            <button className='message'>
                                <FiMessageCircle size={20} />
                                <p>Message</p>
                            </button>
                            <button className='unfavorite'
                                    onClick={() => handleClick(favorite.userID)}
                            >
                                <FiUserMinus size={20} />
                                <p>Unfavorite</p>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export const Facebook = () => {
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const [friends, setFriends] = useState([]); 
    const [isFetch, setIsFetch] = useState(true);
    const [next, setNext] = useState('');
    const [favoritesID, setFavoriteID] = useState([])
    const favorites = useSelector(state => state.favorites);
    useEffect(() => {
        favorites.map(favorite => {
            setFavoriteID([...favoritesID, favorite.userID])
        })
    }, [favorites])
    useEffect(() => {
        const async_function = async () => {
            const data = await get_facebook_friend(token);
            setFriends(data.friends.data);
            setNext(data.friends.paging.next);
            setIsFetch(false);
        }
        if (token) {
            async_function();
        }
    }, [token])
    const handleNext = async () => {
        if (next) {
            setIsFetch(true);
            const data = await get_next_friend(next);
            if (data.data) {
                setFriends([...friends, ...data.data]);
                setNext(data.paging.next);
            }
            setIsFetch(false);
        }
    }
    const handleClick = (event, friend) => {
        const format = {
            name: friend.name,
            id: friend.id,
            avatar: friend.picture.data.url
        }
        dispatch(add_favorite(format));
        event.currentTarget.style.display = 'none';
    }
    const checkId = (user_id) => {
        const result = favoritesID.filter(id => {
            if (`${id}` === `${user_id}`) {
                return true;
            }
        });
        if (result.length) {
            return true;
        } else {
            return false;
        }
    }
    return (
        isFetch 
        ? (<Loading />)
        :
        <div className='facebook'>
            {friends
                ? null
                : <NoneResult/>
            }
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
                            {checkId(friend.id)
                                ? null
                                : (
                                    <button className='favorite'
                                            onClick={(e) => handleClick(e,friend)}
                                    >
                                        <FiUserPlus size={20} />
                                        <p>Favorite</p>
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
            ))}
            {next
                ? (
                    <div className='facebook-footer'>
                        <button className='more' onClick={() => handleNext()}>More</button>
                    </div>
                )
                : null
            } 
        </div>
    );
}

const NoneResult = () => {
    return (
        <div className='none-result'>
            <p>You don't have anything here</p>
        </div>
    )
}

export const Avatar = (props) => {
    return (
        <div className='avatar'>
            <img src={props.url} />
        </div>
    );
};