import React, {useState, useEffect} from 'react';
import {FiFacebook} from 'react-icons/fi';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';


export default function Facebook() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [buttonContent, setButtonContent] = useState(null);
    const [user, setUser] = useState({
        userID: '',
        name: '',
        email: '',
        picture: ''
    });
    useEffect(() => {
        if (isLoggedIn) {
            setButtonContent(null);
        } else {
            setButtonContent(
                (
                    <FacebookLogin
                        appId="567500377224019"
                        scope="public_profile, email, user_birthday,user_friends,user_photos"
                        fields="name,email,picture,friends,photos"
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
    const responseFacebook = (response) => {
        if (response.id && !isLoggedIn) {
            setUser({
                userID: response.id,
                name: response.name,
                email: response.email,
                picture: response.picture.data.url
            });
            setIsLoggedIn(true);
        }
    };
    const componentClicked = (event) => {
    };
    return (
        <div className='wrap-login-button'>
            {buttonContent}
        </div>
    );
};
