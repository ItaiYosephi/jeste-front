'use strict';

import JesteService from '@/services/JesteService';

export default {
    state: {
        jestes: [],
    },
    mutations: {
        loadJestes(state, { jestes }) {
            state.jestes = jestes;
        },
        addJeste(state, { jeste }) {
            state.jestes.push(jeste);
        },
        updateJeste(state, { jeste }) {
            const jesteIdx = state.jestes.findIndex(currJeste => currJeste._id === jeste._id);
            state.jestes.splice(jesteIdx, 1, jeste);
        },
        deleteJeste(state, { jesteId }) {
            state.jestes = state.jestes.filter(jeste => jeste._id !== jesteId);
        }
    },
    getters: {
        jestesToDisplay(state) {
            return state.jestes;
        },
        getJeste: (state) => (id) => {
            return state.jestes.find(jeste => jeste._id === id)
          },
        // TODO: add supoort in 2level array (array of keywords)
        // JesteKeywords(state) {
        // 	let keywords = [];
        // 	state.jestes.forEach(jeste => keywords.push(jeste.keywords));
        // 	return [...new Set(keywords)];
        // },
        emptyJeste() {
            // TODO: Check the fields and add/remove/edit by needs
            return {
                from_loc: '',
                destination_loc: '',
                req_user_id: '',
                price: '',
                description: '',
                keywords: [],
                imgs_url: [],
                time_frame: 1,
            }
        },
    },
    actions: {
        loadJestes(context, { filterBy }) {
            // filterBy = { coords: [32.0852, 34.781768] };
            return JesteService.query(filterBy)
                .then(jestes => {
                    context.commit({ type: 'loadJestes', jestes })
                    return jestes;
                })
        },
        getJesteById(context, { id }) {
            return JesteService.getJesteByID(id)
                .then(jeste => jeste)
        },
        saveJeste(context, { jesteToSave }) {
            // if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
            const isEdit = !!jesteToSave._id;
            return JesteService.saveJeste(jesteToSave)
                .then(jeste => {
                    if (isEdit) context.commit({ type: 'updateJeste', jeste })
                    else context.commit({ type: 'addJeste', jeste })
                    return jeste;
                })
                .catch(err => err)
        },
        deleteJeste(context, { jesteId }) {
            // if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
            return JesteService.deleteJeste(jesteId)
                .then(() => context.commit({ type: 'deleteJeste', jesteId }))
                .catch(err => err)
        }
    }
}