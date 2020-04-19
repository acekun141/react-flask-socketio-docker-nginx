import React from 'react';
import LoginFacebook from '../components/LoginFacebook';


export default function LoginPage() {
    return (
        <div className='login-page'>
            <p className='title'>
                Login First Please!
            </p>
            <LoginFacebook />
        </div>
    );
};
