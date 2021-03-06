'use strict';

import axios from 'axios';

const URL = (process.env.NODE_ENV !== 'development') ? '/jeste' : '//localhost:3000/jeste';
const CHAT_URL = (process.env.NODE_ENV !== 'development') ? '/chat' : '//localhost:3000/chat';

function query({ txt = '', coords = '', category = '', maxDistance = 10000, maxPrice = 200, sortBy = '' }) {

    const query = `?q=${txt}&coords=${coords}&category=${category}&maxDistance=${maxDistance}&maxPrice=${maxPrice}&sortBy=${sortBy}`;
    return axios.get(`${URL}/${query}`)
        .then(res => res.data)
        .catch(err => {
            console.warn('Had a problem to load jestes:');
            console.log(err);
            return err;
        });
}

function getJestesStats() {
    return axios.get(`${URL}/stats`)
        .then(res => res.data)
        .catch(err => {
            console.warn('Had a problem to load jestes stats:');
            console.log(err);
            return err;
        });
}

function getJesteByID(jesteId) {
    return axios.get(`${URL}/${jesteId}`)
        .then(res => res.data)
        .catch(err => {
            console.warn(`Had a problem to load jeste ${jesteId}:`);
            console.log(err);
            return err;
        });
}

function deleteJeste(jesteId) {
    return axios.delete(`${URL}/${jesteId}`, jesteId)
        .then(res => res.data)
        .catch(err => err);
}

function saveJeste(jeste) {
    if (jeste._id) {
        delete jeste.req_user
        return axios.put(`${URL}/${jeste}`, jeste)
            .then(res => res.data)
            .catch(err => {
                console.warn('Failed to update jeste');
                console.log(err);
            });
    } else {
        return axios.post(`${URL}`, jeste)
            .then(res => res.data);
    }
}

function getChatHistory(jesteId) {
    return axios.get(`${CHAT_URL}/${jesteId}`)
        .then(res => res.data)
        .catch(err => {
            console.warn(`Had a problem to load chat history of jeste ${jesteId}:`);
            console.log(err);
            return err;
        });
}

export default {
    query,
    getJestesStats,
    getJesteByID,
    deleteJeste,
    saveJeste,
    getChatHistory
}