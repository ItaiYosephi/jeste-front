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
					if (!user._id) throw 'Not Logged';
					context.commit(USER_LOAD, { user });
					return user;
				})
				.catch(err => Promise.reject(err))
		},
		[USER_LOGIN](context, { user }) {
			return AuthService.login(user)
				.then(user => {
					context.commit({ type: USER_LOAD, user });
					return user;
				})
				.catch(err => {
					console.log(err);
					
				})
		},
		[USER_LOGOUT](context) {
			return AuthService.logout()
				.then(context.commit(USER_LOGOUT))
				.catch(err => err)
		}
	}
}