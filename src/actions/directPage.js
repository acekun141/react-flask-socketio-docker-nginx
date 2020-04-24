export const get_room = async (room_id) => {
    try {
        const response = await fetch(`/chat/room/${room_id}`,
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