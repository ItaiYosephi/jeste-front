import axios from 'axios'
const URL = (process.env.NODE_ENV !== 'development') ? '/user' : '//localhost:3000/user';

function query() {
    return axios.get(`${URL}`)
        .then(res => res.data)
        .catch(err => {
            console.warn('Had a problem to load users:');
            console.log(err);
            return err;
        });
}

function getUserByID(userId) {
    return axios.get(`${URL}/${userId}`)
        .then(res => res.data)
        .catch(err => {
            console.warn(`Had a problem to load user ${userId}:`);
            console.log(err);
            return err;
        });
}

// function deleteUser(userId) {
//     return axios.delete(`${URL}/${userId}`, userId)
//         .then(res => res.data)
//         .catch(err => err);
// }

function saveUser(user) {
    if (user._id) {
        return axios.put(`${URL}/${user}`, user)
            .then(res => res.data)
            .catch(err => {
                console.warn('Failed to update user');
                console.log(err);
            });
    } else {
        return axios.post(`${URL}`, user)
            .then(res => res.data)
            .catch(err => {
                console.warn('Failed to add user');
                console.log(err);
            });
    }
}

export default {
    query,
    getUserByID,
    saveUser
}