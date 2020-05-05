import {SIGN, GET_USER, LOGOUT} from './actionTypes';

export const sign = (data) => async (dispatch) => {
    try {
        const response = await fetch('https://whochattingapi.herokuapp.com/auth/sign',
	{
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'same-origin',
		body: JSON.stringify(data)
	}); 
        if (response.status !== 200) {
            throw('Error');
        } else {
            const data = await response.json();
            if (data.token) {
                return dispatch({
                    type: SIGN,
                    payload: data.token
                });
            } else {
                throw('Error');
            }
        }
    } catch(error) {
        alert('Cannot login! Try later');
    }
};

export const get_user = () => (dispatch) => {
    return dispatch({
        type: GET_USER
    });
};

export const log_out = () => (dispatch) => {
    return dispatch({
        type: LOGOUT
    })
}
