import React from 'react';
import {Avatar} from './HomePage';
import {FiSend, FiUserCheck, FiUserX} from 'react-icons/fi';


export default function DirectPage() {
    return (
        <div className='module-directpage'>
            <div className='left-side'>
                <div className='side-header'>
                    <button className='choose friends active'>
                        <FiUserCheck size={20} />
                        <p>Friends</p>
                    </button>
                    <button className='choose unknown'>
                        <FiUserX size={20} />
                        <p>Unknown</p>
                    </button>
                </div>
                <div className='wrap-list-friend'>
                    <button className='friend'>
                        <div className='friend-left'>
                            <Avatar />
                        </div>
                        <div className='friend-right'>
                            <p className='name'>Le Viet Hung</p>
                            <p className='current'>Current message</p>
                        </div>
                    </button>
                </div>
            </div>
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
        </div>
    );
};
