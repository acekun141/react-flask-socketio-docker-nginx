import {
    GET_FAVORITES,
    ADD_FAVORITE,
    REMOVE_FAVORITE
} from './actionTypes';

const initialState = [];

export default function(state=initialState, action) {
    switch (action.type) {
        case GET_FAVORITES:
            return action.payload;
        case ADD_FAVORITE:
            try {
                state.map(favorite => {
                    if (favorite.userID === action.payload.userID) {
                        throw('Error')
                    }
                })
                return [...state, action.payload];
            } catch(error) {
                return state
            }
        case REMOVE_FAVORITE:
            return state.filter(friend => friend.userID !== action.payload);
        default:
            return state;
    }
};