import {SIGN, GET_USER} from './actionTypes';
import {Base64} from 'js-base64';

const initialState = {}

export default function(state=initialState, action) {
    switch (action.type) {
        case SIGN:
            try {
                localStorage.setItem('token', action.payload);
                const user_token = action.payload.split('.')[1];
                const user_data = JSON.parse(Base64.decode(user_token));
                return user_data
            }catch(error) {
                alert('Cannot login!Try later!');
                return state;
            }
        case GET_USER:
            try {
                const token = localStorage.getItem('token');
                const user_data_encode = token.split('.')[1];
                const user_data_decode = JSON.parse(Base64.decode(user_data_encode));
                return user_data_decode;
            }catch(error) {
                return state;
            }
        default:
            return state;
    }
};