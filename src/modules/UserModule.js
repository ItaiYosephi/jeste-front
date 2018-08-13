'use strict';

import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
import LocationService from '@/services/LocationService';
import ImgUploadService from '@/services/ImgUploadService';
import NotificationService from '@/services/NotificationService';

export const USER_LOAD = 'user/mutations/userLoad';
export const SET_LOCATION = 'user/mutation/setLocation';

export const USER_LOGOUT = 'user/userLogout';

export const GET_USER_LOCATION = 'user/action/getUserLocation';
export const USER_LOGIN = 'user/actions/userLogin';
export const USER_CHECK_LOGIN = 'user/actions/userCheckLogin';
export const USER_GET_BY_ID = 'user/actions/userGetById';
export const USER_UPLOAD_IMG = 'user/actions/uploadUserImg';
export const USER_SIGNUP = 'user/actions/addUser';
export const LOAD_NOTIFICATIONS = 'user/actions/loadNotificationList';
export const NOTIFICATION_MARK_READ = 'user/actions/notificationsMarkRead';

export const USER_CONNECTED = 'user/getters/userConnected';
export const GET_NOTIFICATIONS = 'user/getters/getNotifications';

export default {
	state: {
		user: null,
		currLocation: { lat: null, lng: null },
		notifications: []
	},
	mutations: {
		[USER_LOAD](state, { user }) {
			if (user) state.user = user;
		},
		[USER_LOGOUT](state) {
			state.user = null;
		},
		[SET_LOCATION](state, { loc }) {
			state.currLocation = loc;
		},
		[LOAD_NOTIFICATIONS](state, { notifications }) {
			state.notifications = notifications;
		},
		[NOTIFICATION_MARK_READ](state, { id }) {
			state.notifications.forEach(item => {
				if (item._id == id) item.isRead = true;
			});
		},
		SOCKET_RECEIVEDNOTIFICATION(state, notification) {
			console.log('recved store');

			state.notifications.unshift(notification);
		}
	},
	getters: {
		[USER_CONNECTED](state) {
			return state.user;
		},
		[GET_USER_LOCATION](state) {
			return state.currLocation;
		},
		[GET_NOTIFICATIONS](state) {
			return state.notifications;
		}
	},
	actions: {
		[USER_CHECK_LOGIN](context) {
			return AuthService.checkLogin().then(user => {
				if (!user._id) throw 'Not Logged';
				context.commit(USER_LOAD, { user });
				return user;
			});
		},
		[USER_LOGIN](context, { user }) {
			return AuthService.login(user).then(user => {
				context.commit({ type: USER_LOAD, user });
				return user;
			});
		},
		[USER_LOGOUT](context) {
			return AuthService.logout().then(context.commit(USER_LOGOUT));
		},
		[USER_GET_BY_ID](context, { id }) {
			return UserService.getUserByID(id).then(user => user[0]);
		},
		[GET_USER_LOCATION](context) {
			console.log('Getting User Location');
			return LocationService.getUserLocation().then(loc => {
				context.commit({ type: SET_LOCATION, loc });
				return loc;
			});
		},
		[USER_UPLOAD_IMG](context, { image }) {
			if (!image) return '';
			return ImgUploadService.uploadImg(image).then(image => image);
		},
		[USER_SIGNUP](context, { user }) {
			return UserService.saveUser(user).then(user => user);
		},
		[LOAD_NOTIFICATIONS](context) {
			return NotificationService.query(context.state.user._id).then(
				notifications =>
					context.commit({ type: LOAD_NOTIFICATIONS, notifications })
			);
			// receivedNotification
		},
		[NOTIFICATION_MARK_READ](context, { id }) {
			console.log('got to id', id);

			let ids = [id];
			NotificationService.markRead(ids).then(_ => {
				context.commit({ type: NOTIFICATION_MARK_READ, id });
			});
			let notifications = context.state.notifications;
			// var ids = notifications.reduce((acc, item) => {
			// 	if (!item.isRead) {
			// 		acc.push(item._id);
			// 	}
			// 	return acc;
			// }, []);
			// if (ids.length > 0) {
			// 	NotificationService.markRead(ids).then(_ => {
			// 		context.commit({ type: NOTIFICATION_MARK_READ });
			// 	});
			// }
		}
	}
};
