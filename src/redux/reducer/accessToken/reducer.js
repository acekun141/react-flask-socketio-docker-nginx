import {GET_TOKEN} from './actionTypes';

const initialState = null

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_TOKEN:
            return action.payload;
        default:
            return state;
    }
}