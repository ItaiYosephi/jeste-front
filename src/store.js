import Vue from 'vue';
import Vuex from 'vuex';

import JesteModule from '@/modules/JesteModule';
import UserModule from '@/modules/UserModule';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		JesteModule,
		UserModule
	},
	state: {

	},
	mutations: {

	},
	actions: {

	},
});
