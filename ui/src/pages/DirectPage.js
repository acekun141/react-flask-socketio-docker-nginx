import React, {useState} from 'react';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';


export default function DirectPage() {
    const [roomInfo, setRoomInfo] = useState({});
    return (
        <div className='module-directpage'>
            <LeftSide setRoomInfo={setRoomInfo} />
            <RightSide roomInfo={roomInfo} />
        </div>
    );
};
