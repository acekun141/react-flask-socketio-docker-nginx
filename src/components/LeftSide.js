import React from 'react';
import {FiUserCheck, FiUserX} from 'react-icons/fi';
import {Avatar} from '../pages/HomePage';


export default function() {
    return (
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
    );
};