'use strict';

import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
import StorageService from '@/services/StorageService';

const USER_KEY = 'loggedUser'

export const USER_LOAD = 'jeste/mutatios/userLoad';

export const USER_LOGOUT = 'jeste/userLogout';

export const USER_LOGIN = 'jeste/actions/userLogin';
export const USER_CHECK_LOGIN = 'jeste/actions/userCheckLogin';

export const USER_CONNECTED = 'jeste/getters/userConnected';

export default {
	state: {
		user: null
	},
	mutations: {
		[USER_LOAD](state, { user }) {
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
		[USER_CHECK_LOGIN](context) {
			return AuthService.checkLogin()
				.then(user => {
					context.commit(USER_LOAD, user );
					return user;
				})
				.catch(err => {
					console.log('No user loggedin');
				})
		},
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