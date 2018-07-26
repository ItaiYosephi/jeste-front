import axios from 'axios'
const URL = (process.env.NODE_ENV !== 'development') ? '' : '//localhost:3000';

function login(user) {
    console.log('nick:', user);
    return axios.put(`${URL}/login`, { user })
        .then(res => {
            console.log('test');
            
            return res.data
        })
        .catch(err => {
            console.log('testcatch');

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
    return axios.put(`${URL}/logout`)
        .then()
        .catch(err => {
            console.warn('Had a problem to log out:');
            console.log(err);
            return err;
        });
}

export default {
    login,
    logout,
    checkLogin
}