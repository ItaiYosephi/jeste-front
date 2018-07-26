import axios from 'axios'
const URL = (process.env.NODE_ENV !== 'development') ? '' : '//localhost:3000';

function login(nickname) {
    console.log('nick:', nickname);
    return axios.put(`${URL}/login`, { nickname })
        .then(res => res.data)
        .catch(err => {
            console.warn('Had a problem to log in:');
            console.log(err);
            return err;
        });
}

function checkLogin() {
    return axios.put(`${URL}/checklogin`)
        .then(res => res.data)
        .catch();
}

function logout() {
    return axios.post(`${URL}/logout`)
        .then()
        .catch(err => {
            console.warn('Had a problem to log out:');
            console.log(err);
            return err;
        });
}

export default {
    login,
    logout
}