'use strict';
import axios from 'axios'

const URL = (process.env.NODE_ENV !== 'development') ? '/jeste' : '//localhost:3000/jeste';

function query({ coords = '', q= '' }) {
    const query = `?coords=${coords}&q=${q}`;
    return axios.get(`${URL}/${query}`)
        .then(res => res.data)
        .catch(err => {
            console.warn('Had a problem to load jestes:');
            console.log(err);
            return err;
        });
}

function getJesteByID(jesteId) {    
    return axios.get(`${URL}/${jesteId}`)
        .then(res => {            
            return res.data
        })
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
            .then(res => {
                    console.log('got data', res.data);
                    
                return res.data
            })
            .catch(err => {
                console.warn('Failed to update jeste');
                console.log(err);
            });
    } else {
        return axios.post(`${URL}`, jeste)
            .then(res => res.data);
    }
}

export default {
    query,
    getJesteByID,
    deleteJeste,
    saveJeste,
    // filterJestes,
}