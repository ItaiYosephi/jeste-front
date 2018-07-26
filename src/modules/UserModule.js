'use strict';

import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';

export const USER_LOAD = 'user/mutations/userLoad';

export const USER_LOGOUT = 'user/userLogout';

export const USER_LOGIN = 'user/actions/userLogin';
export const USER_CHECK_LOGIN = 'user/actions/userCheckLogin';

export const USER_CONNECTED = 'user/getters/userConnected';

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
		},
		[USER_LOGIN](context, { user }) {
			return AuthService.login(user)
				.then(user => {
					context.commit({ type: USER_LOAD, user });
					return user;
				})
		},
		[USER_LOGOUT](context) {
			return AuthService.logout()
				.then(context.commit(USER_LOGOUT))
		}
	}
}