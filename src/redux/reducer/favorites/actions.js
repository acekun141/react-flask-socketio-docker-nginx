import { GET_FAVORITES, REMOVE_FAVORITE, ADD_FAVORITE } from "./actionTypes";

export const get_favorites = () => async (dispatch) => {
    try {
        const response = await fetch('/auth/favorite',
            {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            }
        );
        const data = await response.json();
        if (data.favorites) {
            return dispatch({
                type: GET_FAVORITES,
                payload: data.favorites
            });
        } else {
            throw('error')
        }
    } catch(error) {
        console.log(error);
        alert('something wrong! sorry about that!');
    }
}

export const add_favorite = (user) => async (dispatch) => {
    try {
        const response = await fetch('/auth/favorite',
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({userID: user.id})
            }
        );
        const data = await response.json();
        if (data.message) {
            return dispatch({
                type: ADD_FAVORITE,
                payload: user
            });
        } else {
            throw('error')
        }
    } catch(error) {
        alert('something wrong! sorry about that!');
    }
}


export const remove_favorite = (user_id) => async (dispatch) => {
    try {
        const response = await fetch('/auth/favorite',
            {
                method: 'DELETE',
                cache: 'no-cache',
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userID: user_id})
            }
        );
        const data = await response.json();
        if (data.message) {
            return dispatch({
                type: REMOVE_FAVORITE,
                payload: user_id
            });
        } else {
            throw('error')
        }
    } catch(error) {
        alert('something wrong! sorry about that!');
    }
}