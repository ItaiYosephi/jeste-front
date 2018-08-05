import Vue from 'vue';
import Vuex from 'vuex';

import JesteModule from '@/modules/JesteModule';
import UserModule from '@/modules/UserModule';

Vue.use(Vuex);

export const UPDATE_TITLE = 'store/mutations/updateTtile'
export const GET_TITLE = 'store/getters/getTitle'

export default new Vuex.Store({
	modules: {
		JesteModule,
		UserModule
	},
	state: {
		title: 'Jeste'
	},
	mutations: {
		[UPDATE_TITLE](state, {title}) {
			state.title = title
		}
	},
	actions: {},
	getters:{
		[GET_TITLE](state) {
			return state.title
		}
	},
});