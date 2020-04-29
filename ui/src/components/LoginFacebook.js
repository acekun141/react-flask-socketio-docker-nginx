import React, {useState, useEffect} from 'react';
import {sign} from '../redux/reducer/user/actions';
import {FiFacebook} from 'react-icons/fi';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

export default function Facebook() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [buttonContent, setButtonContent] = useState(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    useEffect(() => {
        if (isLoggedIn) {
            setButtonContent(null);
        } else {
            setButtonContent(
                (
                    <FacebookLogin
                        appId="567500377224019"
                        scope="public_profile,email,user_friends"
                        fields="name,email,picture"
                        onClick={componentClicked}
                        callback={responseFacebook}
                        render={renderProps => (
                            <button onClick={renderProps.onClick}>
                                <FiFacebook size={30} />
                                <p>Login With Facebook</p>
                            </button>
                        )}
                    />
                )
            );
        }
    }, [isLoggedIn]);
    useEffect(() => {
        if (user.name) {
            history.replace('/');
        }
    }, [user]);
    const responseFacebook = (response) => {
        if (response.id && !isLoggedIn) {
            dispatch(sign(response));
            setIsLoggedIn(true);
        }
    };
    const componentClicked = (event) => {};
    return (
        <div className='wrap-login-button'>
            {buttonContent}
        </div>
    );
};
