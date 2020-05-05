export const get_room = async (room_id) => {
    try {
        const response = await fetch(`https://whochattingapi.herokuapp.com/chat/room/${room_id}`,
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },
            }
        );
        const data = await response.json();
        if (data.error) {
            throw(new Error('error'));
        } else {
            return data;
        }
    } catch(error) {
        alert('Cannot login! Try later');
        return false;
    }
}

export const get_all_room = async () => {
    try {
        const response = await fetch('https://whochattingapi.herokuapp.com/chat/room',
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },
            }
        );
        const data = await response.json();
        if (data.error) {
            throw(new Error('error'));
        } else {
            return data;
        }
    } catch(error) {
        alert('Cannot login! Try later');
        return false;
    }
};

export const seen_room = async (room_id) => {
    try {
        const response = await fetch('https://whochattingapi.herokuapp.com/chat/room/seen', {
            method: 'POST',
            headers: {
                'x-access-token': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({room_id})
        })
        const data = await response.json();
        if (data.error) {
            throw(new Error('error'));
        } else {
            return data;
        }
    } catch(error) {
        console.log('can seen room');
    }
}
