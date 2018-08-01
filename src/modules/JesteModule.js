'use strict';

import JesteService from '@/services/JesteService';
import ImgUploadService from '@/services/ImgUploadService';

export const JESTE_ADD = 'jeste/mutations/addJeste';
export const JESTE_UPDATE = 'jeste/mutations/updateJeste';
export const FILTER_UPDATE = 'jeste/mutations/updateFilter';

export const JESTES_LOAD = 'jeste/jestesLoad';
export const JESTE_SAVE = 'jeste/jesteSave';
export const JESTE_DELETE = 'jeste/jesteDelete';

export const JESTE_GET_BY_ID = 'jeste/actions/getJesteById';
export const JESTE_UPLOAD_IMG = 'jeste/actions/uploadJesteImg';

export const JESTE_GET = 'jeste/getters/getJeste';
export const JESTES_TO_DISPLAY = 'jeste/getters/jestesToDisplay';
export const JESTE_EMPTY = 'jeste/getters/emptyJeste';
export const JESTE_CATEGORIES_GET = 'jeste/getters/getJesteCategories';
export const FILTER_GET = 'jeste/getters/getFilterBy';

import { USER_CONNECTED } from './UserModule'

export default {
	state: {
		jestes: [],
		categories: ['All', 'Delivery', 'Work', 'Other'],
		filterBy: {
			coords: '',
			txt: '',
			category: '',
			maxDistance: 100000,
			maxPrice: 200
		}
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
		[JESTE_DELETE](state, { id }) {
			state.jestes = state.jestes.filter(jeste => jeste._id !== id);
		},
		[FILTER_UPDATE](state, { filter }) {
			for (let prop in filter) {
				if (filter[prop] && prop !== 'coords') state.filterBy[prop] = filter[prop];
				else if (filter[prop] && prop === 'coords') state.filterBy.coords = `${filter.coords.lat},${filter.coords.lng}`;
			}
		}
	},
	getters: {
		[FILTER_GET](state) {
			return state.filterBy;
		},
		[JESTE_CATEGORIES_GET](state) {
			return state.categories;
		},
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
				destination_loc: { "type": "Point", coordinates: [null, null] },
				ended_at: null,
				req_user_id: null,
				res_user_id: null,
				created_at: null,
				title: '',
				description: '',
				price: '',
				category: '',
				address_components: null,
				formatted_address: '',
				time_frame: { from: '', until: '' },
				keywords: [],
				status: 0,
			}
		},
	},
	actions: {
		[JESTES_LOAD](context, { filterBy = '' }) {
			if (!filterBy) filterBy = context.state.filterBy;
			// filterBy.coords = context.rootState.UserModule.state.currLocation
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
		[JESTE_UPLOAD_IMG](context, { image }) {
			if (!image) return '';
			return ImgUploadService.uploadImg(image)
				.then(image => image)
		},
		[JESTE_SAVE](context, { jesteToSave }) {
			// if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
			const isEdit = !!jesteToSave._id;
			if (!isEdit) jesteToSave.req_user_id = context.getters[USER_CONNECTED]._id
			return JesteService.saveJeste(jesteToSave)
				.then(jeste => {
					if (isEdit) context.commit({ type: JESTE_UPDATE, jeste })
					else context.commit({ type: JESTE_ADD, jeste })
					return jeste;
				})
		},
		[JESTE_DELETE](context, { id }) {
			// if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
			return JesteService.deleteJeste(id)
				.then(() => context.commit({ type: JESTE_DELETE, id }))
				.catch(err => err)
		}
	}
}