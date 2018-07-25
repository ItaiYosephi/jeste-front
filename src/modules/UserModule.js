'use strict';

import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
import StorageService from '@/services/StorageService';

const USER_KEY = 'loggedUser'

export const USER_LOAD = 'toy/mutations/userLoad';

export const USER_LOGOUT = 'toy/userLogout';

export const USER_LOGIN = 'toy/actions/userLogin';

export const USER_CONNECTED = 'toy/getters/userConnected';

export default {
	state: {
		user: null
	},
	mutations: {
		[USER_LOAD](state) {
			let user = StorageService.loadFromStorage(USER_KEY);
			if (user) state.user = user;
		},
		[USER_LOGOUT](state) {
			state.user = null
			StorageService.removeFromStorage(USER_KEY);
		}
	},
	getters: {
		[USER_CONNECTED](state) {
			return state.user;
		}
	},
	actions: {
		[USER_LOGIN](context, { email }) {
			return AuthService.login(email)
				.then(user => {
					StorageService.saveToStorage(USER_KEY, user);
					context.commit(USER_LOAD);
					return user;
				})
		},
		[USER_LOGOUT](context) {
			return AuthService.logout()
				.then(context.commit(USER_LOGOUT))
				.catch(err => err)
		}
	}
}