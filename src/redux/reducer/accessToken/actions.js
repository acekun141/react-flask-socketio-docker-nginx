import {GET_TOKEN} from './actionTypes';

export const get_token = () => async (dispatch) => {
    try {
        const response = await fetch('/auth/token',
            {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            }
        );
        const data = await response.json();
        if (data.access_token) {
            return dispatch({
                type: GET_TOKEN,
                payload: data.access_token
            });
        } else {
            throw('Error')
        }
    } catch(error) {
        alert('Something wrong! Sorry about that!');
    }
};