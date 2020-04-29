import {combineReducers} from 'redux';
import user from './user/reducer';
import token from './accessToken/reducer';
import favorites from './favorites/reducer';

export default combineReducers({user, token, favorites})