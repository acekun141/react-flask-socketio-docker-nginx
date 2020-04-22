import React, {useEffect} from 'react';
import LoginFacebook from '../components/LoginFacebook';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';


export default function LoginPage() {
    const user = useSelector(state => state.user);
    const history = useHistory();
    useEffect(() => {
        if (user.name) {
            history.replace('/');
        } 
    }, [user]);
    return (
        <div className='login-page'>
            <p className='title'>
                Login First Please!
            </p>
            {user.name
                ? (
                    <div>
                        <p>{user.name}</p>
                        <img src={user.avatar}/>
                    </div>
                )
                : null
            }
            <LoginFacebook />
        </div>
    );
};
