'use strict';

import JesteService from '@/services/JesteService';

export const JESTE_ADD = 'jeste/mutations/addJeste';
export const JESTE_UPDATE = 'jeste/mutations/updateJeste';

export const JESTES_LOAD = 'jeste/jestesLoad';
export const JESTE_SAVE = 'jeste/jesteSave';
export const JESTE_DELETE = 'jeste/jesteDelete';

export const JESTE_GET_BY_ID = 'jeste/actions/getJesteById';

export const JESTE_GET = 'jeste/getters/getJeste';
export const JESTES_TO_DISPLAY = 'jeste/getters/jestesToDisplay';
export const JESTE_EMPTY = 'jeste/getters/emptyJeste';
import {USER_CONNECTED} from './UserModule'

export default {
    state: {
        jestes: [],
    },
    mutations: {
        [JESTES_LOAD](state, { jestes }) {
            state.jestes = jestes;
        },
        [JESTE_ADD](state, { jeste }) {
            state.jestes.push(jeste);
        },
        [JESTE_UPDATE](state, { jeste }) {
            const jesteIdx = state.jestes.findIndex(currJeste => currJeste._id === jeste._id);
            state.jestes.splice(jesteIdx, 1, jeste);
        },
        [JESTE_DELETE](state, { jesteId }) {
            state.jestes = state.jestes.filter(jeste => jeste._id !== jesteId);
        }
    },
    getters: {
        [JESTES_TO_DISPLAY](state) {
            return state.jestes;
        },
        [JESTE_GET]: (state) => (id) => {
            return state.jestes.find(jeste => jeste._id === id)
        },
        // TODO: add supoort in 2level array (array of keywords)
        // JesteKeywords(state) {
        // 	let keywords = [];
        // 	state.jestes.forEach(jeste => keywords.push(jeste.keywords));
        // 	return [...new Set(keywords)];
        // },
        [JESTE_EMPTY]() {
            // TODO: Check the fields and add/remove/edit by needs
            return {
                from_loc: '',
                destination_loc:  {"type": "Point",
                coordinates: [
                  0,
                  0
                ]},
                req_user_id: '',
                price: '',
                description: '',
                keywords: [],
                imgs_url: [],
                time_frame: {from: '', until: ''},
                title: '',
                address: {},
                address_str: ''
            }
        },
    },
    actions: {
        [JESTES_LOAD](context, { filterBy }) {
            // filterBy = { coords: [32.0852, 34.781768] };
            return JesteService.query(filterBy)
                .then(jestes => {
                    context.commit({ type: JESTES_LOAD, jestes })
                    return jestes;
                })
        },
        [JESTE_GET_BY_ID](context, { id }) {
            return JesteService.getJesteByID(id)
                .then(jeste => jeste)
        },
        [JESTE_SAVE](context, { jesteToSave }) {
            console.log();
            
            // if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
            const isEdit = !!jesteToSave._id;
            if (!isEdit) jesteToSave.req_user_id =  context.getters[USER_CONNECTED]._id
            console.log(jesteToSave);
            
            return JesteService.saveJeste(jesteToSave)
                .then(jeste => {
                    if (isEdit) context.commit({ type: JESTE_UPDATE, jeste })
                    else context.commit({ type: JESTE_ADD, jeste })
                    return jeste;
                })
                .catch(err => err)
        },
        [JESTE_DELETE](context, { jesteId }) {
            // if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
            return JesteService.deleteJeste(jesteId)
                .then(() => context.commit({ type: JESTE_DELETE, jesteId }))
                .catch(err => err)
        }
    }
}