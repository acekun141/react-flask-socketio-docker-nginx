export const get_facebook_friend = async (token) => {
    try {
        // const response = await fetch(`https://graph.facebook.com/v6.0/me?fields=friends.limit=(1)%7Bpicture%7Burl%7D%2Cname%7D&access_token=${token}`);
        const response = await fetch(`https://graph.facebook.com/v6.0/me?fields=friends.limit(10)%7Bpicture%7Burl%7D%2Cname%7D&access_token=${token}"
`)
        const data = await response.json();
        if (data.friends) {
            return data;
        } else {
            throw('Error');
        }
    } catch(error) {
        alert('Something wrong. Try later');
        return null;
    }
}

export const get_next_friend = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.data) {
            return data;
        } else {
            throw('Error');
        }
    } catch(error) {
        alert('Something wrong. Try later');
        return null;
    }
}