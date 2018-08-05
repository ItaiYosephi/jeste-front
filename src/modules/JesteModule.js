'use strict';

import JesteService from '@/services/JesteService';
import ImgUploadService from '@/services/ImgUploadService';

export const JESTE_ADD = 'jeste/mutations/addJeste';
export const JESTE_UPDATE = 'jeste/mutations/updateJeste';
export const FILTER_UPDATE = 'jeste/mutations/updateFilter';
export const TOGGLE_LOADING = 'jeste/mutations/toggleLoad';
export const UPDATE_TXT_FILTER = 'jeste/mutations/updateTxtFilter';
export const UPDATE_MAXPRICE_FILTER = 'jeste/mutations/updateMaxPriceFilter';
export const UPDATE_CATEGORY_FILTER = 'jeste/mutations/updateCategoryFilter';
export const UPDATE_MAXDISTANCE_FILTER = 'jeste/mutations/updateMaxDistanceFilter';
export const UPDATE_RES_JESTE = 'jeste/mutations/updateResJeste';

export const JESTES_LOAD = 'jeste/jestesLoad';
export const JESTE_SAVE = 'jeste/jesteSave';
export const JESTE_DELETE = 'jeste/jesteDelete';

export const JESTE_GET_BY_ID = 'jeste/actions/getJesteById';
export const JESTE_UPLOAD_IMG = 'jeste/actions/uploadJesteImg';
export const GET_CHAT_HISTORY = 'jeste/actions/getChatHistory';

export const JESTE_GET = 'jeste/getters/getJeste';
export const JESTES_TO_DISPLAY = 'jeste/getters/jestesToDisplay';
export const JESTE_EMPTY = 'jeste/getters/emptyJeste';
export const JESTE_CATEGORIES_GET = 'jeste/getters/getJesteCategories';
export const JESTE_IS_LOADING = 'jeste/getters/loadingJeste';
export const FILTER_GET = 'jeste/getters/getFilterBy';

import { USER_CONNECTED } from './UserModule';

export default {
	state: {
		jestes: [],
		categories: ['All', 'Delivery', 'Work', 'Animal', 'Technology', 'Other'],
		filterBy: {
			coords: '',
			txt: '',
			category: '',
			maxDistance: 50000,
			maxPrice: 200
		},
		isLoading: false
	},
	mutations: {
		[JESTES_LOAD](state, { jestes }) {
			state.jestes = jestes;
		},
		[JESTE_ADD](state, { jeste }) {
			state.jestes.push(jeste);
		},
		[JESTE_UPDATE](state, { jeste }) {
			const jesteIdx = state.jestes.findIndex(
				currJeste => currJeste._id === jeste._id
			);
			state.jestes.splice(jesteIdx, 1, jeste);
		},
		[JESTE_DELETE](state, { id }) {
			state.jestes = state.jestes.filter(jeste => jeste._id !== id);
		},
		[FILTER_UPDATE](state, { filter }) {
			for (let prop in filter) {
				if (filter[prop]) {
					if (prop !== 'coords') {
						state.filterBy[prop] = filter[prop];
					} else {
						state.filterBy.coords = `${filter.coords.lat},${filter.coords.lng}`;
					}
				}
			}
		},
		[TOGGLE_LOADING](state, { isLoad }) {
			state.isLoading = isLoad;
		},
		[UPDATE_TXT_FILTER](state, { txt }) {
			state.filterBy.txt = txt;
		},
		[UPDATE_CATEGORY_FILTER](state, { val }) {
			state.filterBy.category = val;
		},
		[UPDATE_CATEGORY_FILTER](state, { val }) {
			state.filterBy.category = val;
		},
		[UPDATE_MAXPRICE_FILTER](state, { val }) {
			state.filterBy.maxPrice = val;
		},
		[UPDATE_MAXDISTANCE_FILTER](state, { val }) {
			state.filterBy.maxDistance = val;
		},
		[UPDATE_RES_JESTE](state, {jeste}) {
			let idx = state.jestes.findIndex(currJeste => {return currJeste._id === jeste._id} )
			if (idx > -1) {
				state.jestes.splice(idx, 1 , jeste)
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
		[JESTE_GET]: state => id => {
			return state.jestes.find(jeste => jeste._id === id);
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
				destination_loc: { type: 'Point', coordinates: [null, null] },
				ended_at: null,
				req_user_id: null,
				res_user_id: null,
				created_at: null,
				title: '',
				description: '',
				price: 50,
				category: '',
				img: {},
				address_components: null,
				formatted_address: '',
				time_frame: { from: '', until: '' },
				keywords: [],
				status: 0
			};
		},
		[JESTE_IS_LOADING](state) {
			return state.isLoading;
		}
	},
	actions: {
		[JESTES_LOAD](context) {
			context.commit({ type: TOGGLE_LOADING, isLoad: true });
			let filterBy = { ...context.state.filterBy };
			// filterBy.coords = context.rootState.UserModule.state.currLocation
			return JesteService.query(filterBy).then(jestes => {
				context.commit({ type: JESTES_LOAD, jestes });
				context.commit({ type: TOGGLE_LOADING, isLoad: false });

				return jestes;
			});
		},
		[JESTE_GET_BY_ID](context, { id }) {
			context.commit({ type: TOGGLE_LOADING, isLoad: true });
			return JesteService.getJesteByID(id).then(jeste => {
				context.commit({ type: TOGGLE_LOADING, isLoad: false });
				return jeste;
			});
		},
		[JESTE_UPLOAD_IMG](context, { image }) {
			if (!image) return '';
			return ImgUploadService.uploadImg(image)
				.then(image => image);
		},
		[JESTE_SAVE](context, { jesteToSave }) {
			// if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
			const isEdit = !!jesteToSave._id;
			if (!isEdit)
				jesteToSave.req_user_id = context.getters[USER_CONNECTED]._id;
			return JesteService.saveJeste(jesteToSave).then(jeste => {
				if (isEdit) context.commit({ type: JESTE_UPDATE, jeste });
				else context.commit({ type: JESTE_ADD, jeste });
				return jeste;
			});
		},
		[JESTE_DELETE](context, { id }) {
			// if (!context.getters[IS_ADMIN]) return Promise.reject('No Permissions');
			return JesteService.deleteJeste(id)
				.then(() => context.commit({ type: JESTE_DELETE, id }))
				.catch(err => err);
		},
		[GET_CHAT_HISTORY](context, { jesteId }) {
			return JesteService.getChatHistory(jesteId)
				.then(res => res)
				.catch(err => err);
		}
	}
};
