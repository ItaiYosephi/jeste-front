'use strict';

import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
import LocationService from '@/services/LocationService';
import { resolve } from 'url';

export const USER_LOAD = 'user/mutations/userLoad';
export const SET_LOCATION = 'user/mutation/setLocation';

export const USER_LOGOUT = 'user/userLogout';

export const GET_USER_LOCATION = 'user/action/getUserLocation';
export const USER_LOGIN = 'user/actions/userLogin';
export const USER_CHECK_LOGIN = 'user/actions/userCheckLogin';
export const USER_GET_BY_ID = 'user/actions/userGetById';

export const USER_CONNECTED = 'user/getters/userConnected';

export default {
	state: {
		user: null,
		currLocation: {lat: null, lng: null}
	},
	mutations: {
		[USER_LOAD](state, { user }) {
			if (user) state.user = user;
		},
		[USER_LOGOUT](state) {
			state.user = null
		},
		[SET_LOCATION](state, {loc}) {
			state.currLocation = loc;
		}
	},
	getters: {
		[USER_CONNECTED](state) {
			return state.user;
		},
		[GET_USER_LOCATION](state) {
			return state.currLocation
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
		},
		[USER_GET_BY_ID](context, {id}) {
			return UserService.getUserByID(id)
				.then(user => user[0])
		},
		[GET_USER_LOCATION](context) {
			return LocationService.getUserLocation()
			 .then(loc => {
				context.commit({type: SET_LOCATION, loc})
				console.log('first',loc);
				return loc;
		   })
		}
	}
}