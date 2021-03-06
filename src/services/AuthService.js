'use strict';

import axios from 'axios';

const URL = (process.env.NODE_ENV !== 'development') ? '' : '//localhost:3000';

function login(user) {
    return axios.put(`${URL}/login`, { user })
        .then(res => res.data)
        .catch(err => {
            console.warn('Had a problem to log in:');
            return Promise.reject(err);
        });
}

function checkLogin() {
    return axios.put(`${URL}/checklogin`)
        .then(res => res.data)
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