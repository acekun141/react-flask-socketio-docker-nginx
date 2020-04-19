import React from 'react';
import {Avatar} from './HomePage';
import {FiSend} from 'react-icons/fi';


export default function DirectPage() {
    return (
        <div className='module-directpage'>
            <div className='left-side'>
                <div className='search'>
                    <input
                        type='text'
                        placeholder='Find your friend'
                    />
                </div>
                <button className='friend'>
                    <div className='friend-left'>
                        <Avatar />
                    </div>
                    <div className='friend-right'>
                        <p className='name'>Le Viet Hung</p>
                        <p className='current'>Current message</p>
                    </div>
                </button>
                <button className='friend'>
                    <div className='friend-left'>
                        <Avatar />
                    </div>
                    <div className='friend-right'>
                        <p className='name'>Le Viet Hung</p>
                        <p className='current'>Current message</p>
                    </div>
                </button>
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
            <div className='right-side'>
                <div className='side-header'>
                    <Avatar />
                    <p className='title'>
                        Le Viet Hung
                    </p>
                </div>
                <div className='side-content'>
                    <div className='messages'></div>
                    <div className='typing'>
                        <form>
                            <input
                                type='text'
                                placeholder='Message...'
                            />
                            <button>
                                <FiSend size={20}/>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
