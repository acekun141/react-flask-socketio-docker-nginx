import React from 'react';
import {FiSend} from 'react-icons/fi'
import {Avatar} from '../pages/HomePage';

export default function() {
    return (
        <div className='right-side'>
            <div className='side-header'>
                <Avatar />
                <p className='title'>
                    Le Viet Hung
                </p>
            </div>
            <div className='side-content'>
                <div className='messages'>
                    <div className='wrap-message'>
                        <p className='message'>Test message from server</p>
                        <p className='time'>19:38</p>
                    </div>
                    <div className='wrap-message your-message'>
                        <p className='message'>Your message</p>
                        <p className='time'>19:39</p>
                    </div>
                </div>
                <div className='typing'>
                    <form>
                        <input
                            type='text'
                            placeholder='Message...'
                        />
                        <button>
                            <FiSend size={25}/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};