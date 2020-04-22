import {combineReducers} from 'redux';
import user from './user/reducer';
import token from './accessToken/reducer';

export default combineReducers({user, token})