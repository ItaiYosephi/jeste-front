<template>
	<div id="app">
		<v-app>
			<!-- Side Menu (Mobile) -->
			<v-navigation-drawer app v-model="drawer" fixed temporary>

				<v-list class="pa-1">
					<v-list-tile avatar v-if="user">
						<v-list-tile-avatar>
							<img :src="user.img.secure_url">
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title v-if="user">{{user.details.firstName}} {{user.details.lastName}}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>

				<v-list class="pt-0">
					<v-divider></v-divider>
					<v-list-tile v-for="(item, index) in menuItems" :key="item.title" v-if="(index === 2 && !user) || index !== 2" :to="(item.link)" exact>
						<v-list-tile-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{ item.title }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-list-group v-if="user" prepend-icon="account_circle" value="true">
						<v-list-tile slot="activator">
							<v-list-tile-title>{{user.details.firstName}} {{user.details.lastName}}</v-list-tile-title>
						</v-list-tile>
						<v-list-tile :to="`/user/${user._id}`" excat>
							<v-list-tile-title>Profile</v-list-tile-title>
							<v-list-tile-action>
								<v-icon>account_circle</v-icon>
							</v-list-tile-action>
						</v-list-tile>
						<v-list-tile to="/user/settings" excat>
							<v-list-tile-title>Settings</v-list-tile-title>
							<v-list-tile-action>
								<v-icon>settings</v-icon>
							</v-list-tile-action>
						</v-list-tile>
						<v-list-tile @click="logout">
							<v-list-tile-title>Logout</v-list-tile-title>
							<v-list-tile-action>
								<v-icon>exit_to_app</v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list-group>

				</v-list>
			</v-navigation-drawer>

			<!-- Top Menu Toolbar -->
			<v-toolbar ref="navbar" app flat color="primary" class="white--text">
				<v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer" dark>
				</v-toolbar-side-icon>
				<v-toolbar-title class="title-logo" @click="$router.push('/')">jeste</v-toolbar-title>
				<v-spacer class="hidden-xs-only"></v-spacer>
				<!-- Top Menu Links -->
				<v-spacer></v-spacer>
				<v-toolbar-items v-if="user">
					<v-btn flat class="white--text" @click="setAlertsMode('chat')">
						<div class="notify" v-if="chatUnReadCount > 0">{{chatUnReadCount}}</div>
						<v-icon medium >message</v-icon>
						<div class="beeper-nub" v-if="alertsMode === 'chat'"></div>
					</v-btn>
					<v-btn flat class="white--text" @click="setAlertsMode('notifications')">
						<div class="notify" v-if="notificationsUnReadCount > 0">{{notificationsUnReadCount}}</div>
						<v-icon medium >notifications</v-icon>
						<div class="beeper-nub" v-if="alertsMode === 'notifications'"></div>
					</v-btn>
				</v-toolbar-items>
				<v-toolbar-items class="hidden-xs-only btns-wrapper">
					<v-menu mx-2 open-on-hover bottom offset-y v-for="(item, index) in menuItems" :key="index">
						<v-btn flat slot="activator" :to="(item.link)" exact class="white--text">
							{{ item.title }}
						</v-btn>
						<v-list v-if="user && index === 2">
							<v-list-tile :to="`/user/${user._id}`" excat>
								<v-list-tile-title>Profile</v-list-tile-title>
							</v-list-tile>
							<v-list-tile to="/user/settings" excat>
								<v-list-tile-title>Settings</v-list-tile-title>
							</v-list-tile>
							<v-list-tile @click="logout" excat>
								<v-list-tile-title>Logout</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>
				</v-toolbar-items>

			</v-toolbar>
			<v-content class="content">
				<!-- <v-container fluid> -->
				<transition name="moveInUp">
					<router-view v-title="title"></router-view>
				</transition>
				<!-- </v-container> -->
			</v-content>

			<v-snackbar v-model="snackbarDisplay" :top="snackbarProps.y === 'top'" :bottom="snackbarProps.y === 'bottom'" :left="snackbarProps.x === 'left'" :right="snackbarProps.x === 'right'" :multi-line="snackbarProps.mode === 'multi-line'" :vertical="snackbarProps.mode === 'vertical'" :timeout="snackbarProps.timeout" :color="snackbarProps.bgColor">
				{{ snackbarProps.text }}
				<v-btn flat :color="snackbarProps.btnColor" @click="snackbarDisplay = false">
					Close
				</v-btn>
			</v-snackbar>

			<v-snackbar v-model="jesteSnackDisplay" :top="jesteSnackProps.y === 'top'" :bottom="jesteSnackProps.y === 'bottom'" :left="snackbarProps.x === 'left'" :right="snackbarProps.x === 'right'" :multi-line="snackbarProps.mode === 'multi-line'" :vertical="snackbarProps.mode === 'vertical'" :timeout="jesteSnackProps.timeout" color="purple darken-1">
				{{ jesteSnackProps.text }}
				<v-btn flat :color="jesteSnackProps.btnColor" :to="jesteSnackProps.link" @click="jesteSnackDisplay = false">
					Open
				</v-btn>
			</v-snackbar>
			<NotificationList class="alerts" :style="alertsStyle" @close-list="alertsMode = ''" :notifications="notifications" v-if="alertsMode === 'notifications'"></NotificationList>
			<ChatList class="alerts" :style="alertsStyle" @close-list="alertsMode = ''" :chat-list="chatList" v-if="alertsMode === 'chat'"></ChatList>

		</v-app>
		<ChatCmp v-if="isChat"></ChatCmp>

	</div>
</template>

<script>
import ChatCmp from '@/components/ChatChatCmp';
import ChatList from '@/components/ChatListCmp';
import NotificationList from '@/components/NotificationList';

import { EventBus, SNACK_MSG, SNACK_JESTE_IT, SET_CHAT } from '@/services/EventBusService';
import { GET_TITLE } from '@/store';
import { JESTES_LOAD, JESTES_LOAD_RECENT, FILTER_UPDATE, TOGGLE_LOADING, UPDATE_RES_JESTE } from '@/modules/JesteModule';
import { USER_CHECK_LOGIN, USER_CONNECTED, USER_LOGOUT, GET_USER_LOCATION, LOAD_NOTIFICATIONS, GET_NOTIFICATIONS } from '@/modules/UserModule';
import { IS_CHAT, SET_CHAT_USER, LOAD_CHAT_LIST, GET_CHAT_LIST, GET_CHAT_TOTAL_UNREAD } from '@/modules/ChatModule';
export default {
	name: 'app',
	components: {
		ChatCmp,
		ChatList,
		NotificationList
	},
	created() {
		console.log('--- Jeste App ---');
		if (!this.$store.getters.USER_CONNECTED) this.loadUser();
		this.$store.commit({ type: TOGGLE_LOADING, isLoad: true });
		this.$store.dispatch(GET_USER_LOCATION).then(coords => {
			this.$store.commit({ type: FILTER_UPDATE, filter: { coords } });
			this.loadJestes();
		});
	},
	mounted() {
		var elNavbar = this.$refs.navbar.$el;
		this.alertsStyle.top = `${elNavbar.offsetHeight - 2}px`;
		window.addEventListener('resize', x => {
			this.alertsStyle.top = `${elNavbar.offsetHeight - 2}px`;
		});
		EventBus.$on(SNACK_MSG, msg => this.toggleSnackbar(msg));
		EventBus.$on(SNACK_JESTE_IT, msg => this.togglejesteSnack(msg));
		EventBus.$on(SET_CHAT, userId => this.openChat(userId));
	},
	sockets: {
		jesteResponded(jeste) {
			this.$store.commit({ type: UPDATE_RES_JESTE, jeste });
			EventBus.$emit(SNACK_JESTE_IT, {
				text: 'Someone just responded your jeste!',
				link: `/jeste/${jeste._id}`
			});
		}
	},
	data() {
		return {
			alertsMode: '',
			drawer: null,
			menuItems: [
				{ title: 'Home', icon: 'home', link: '/' },
				{ title: 'Jeste', icon: 'assistant', link: '/jeste' },
				{ title: 'Signup \\ Login', icon: 'swap_horizontal_circle', link: '/login' },
				{ title: 'About', icon: 'info', link: '/about' }
			],
			snackbarDisplay: false,
			snackbarProps: {
				y: 'top',
				x: null,
				mode: 'multi-line',
				timeout: 3000,
				text: ''
			},
			jesteSnackDisplay: false,
			jesteSnackProps: {
				y: 'top',
				x: null,
				mode: 'multi-line',
				timeout: 3000,
				text: ''
			},
			alertsStyle: {
				top: '48px'
			}
		};
	},
	computed: {
		user() {
			return this.$store.getters[USER_CONNECTED];
		},
		location() {
			return this.$store.getters[GET_USER_LOCATION];
		},
		title() {
			return this.$store.getters[GET_TITLE];
		},
		isChat() {
			return this.$store.getters[IS_CHAT];
		},
		chatList() {
			return this.$store.getters[GET_CHAT_LIST];
		},
		chatUnReadCount() {
			return this.$store.getters[GET_CHAT_TOTAL_UNREAD];
		},
		notifications() {
			return this.$store.getters[GET_NOTIFICATIONS];
		},
		notificationsUnReadCount() {
			let count = 0;
			this.notifications.forEach(item => {
				if (!item.isRead) count++;
			});
			return count;
		}
	},
	methods: {
		loadUser() {
			this.$store.dispatch(USER_CHECK_LOGIN)
				.then(console.log('User Logged in'))
				.catch(err => console.log(err));
		},
		loadJestes() {
			this.$store.dispatch({ type: JESTES_LOAD });
			this.$store.dispatch(JESTES_LOAD_RECENT);
		},
		pushToLink(link) {
			this.$router.push(link);
		},
		toggleSnackbar(msg) {
			this.snackbarProps.text = msg.text;
			this.snackbarProps.bgColor = msg.bgColor ? msg.bgColor : this.snackbarProps.bgColor;
			this.snackbarDisplay = true;
		},
		togglejesteSnack(msg) {
			this.jesteSnackProps.text = msg.text;
			this.jesteSnackProps.bgColor = msg.bgColor ? msg.bgColor : this.jesteSnackProps.bgColor;
			this.jesteSnackProps.link = msg.link;
			this.jesteSnackDisplay = true;
		},
		logout() {
			let fName = this.$store.getters[USER_CONNECTED].details.firstName;
			this.$store.dispatch(USER_LOGOUT).then(_ => {
				EventBus.$emit(SNACK_MSG, {
					text: `Bey ${fName}`,
					bgColor: '#000'
				});
				console.log('Logged out successfuly');
				this.$router.push('/');
			});
		},
		openChat(userId) {
			this.$store.dispatch({ type: SET_CHAT_USER, userId });
		},
		setAlertsMode(mode) {
			this.alertsMode = this.alertsMode === mode ? '' : mode;
		}
	},
	watch: {
		user() {
			if (this.user) {
				this.$store.dispatch(LOAD_CHAT_LIST);
				this.$store.dispatch(LOAD_NOTIFICATIONS);
				this.$socket.emit('userLogged', { userId: this.user._id });
				this.menuItems[2] = {
					title: this.user.details.firstName + ' ' + this.user.details.lastName,
					link: '#',
					icon: 'account_circle'
				};
			} else {
				this.menuItems[2] = { title: 'Signup \\ Login', link: '/login', icon: 'swap_horizontal_circle' };
			}
		},
		snackbarDisplay() {
			if (!this.snackbarDisplay) {
				this.snackbarProps.bgColor = 'black';
				this.snackbarProps.btnColor = 'white';
			}
		}
	}
};
</script>

<style lang="scss">

.notify {
	background: red;
	color: white;
	padding: 1px 3px;
	position: absolute;
	top: 10%;
	right: 10%;
	border-radius: 5px;
}

.content {
	background: rgba(3, 20, 37, 0.2);
}

.v-toolbar__title:not(:first-child) {
	cursor: pointer;
	min-width: 55px;
	margin: 0 5px !important;
	text-transform: uppercase;
	transition: color 0.3s linear;
}
.v-toolbar__title:not(:first-child):hover {
	color: #031424;
}
.btns-wrapper {
	margin-left: 8px;
}

.moveInUp-enter-active {
	// transition: all 0.4s ease;
	transition: all 0.45s linear;
}
.moveInUp-leave-active {
	transition: all 0.45s linear;
	// transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.moveInUp-enter,
.moveInUp-leave-to {
	// position: absolute;
	position: fixed;
	top: 64px;
}
.moveInUp-enter {
	transform: translateX(-100%);
	position: fixed;
	top: 64px;
}
.moveInUp-leave-to {
	// transform: translateY(100%);
	position: fixed;
	top: 64px;

	transform: translateX(100%);
	opacity: 0;
}

.relative {
	position: relative;
}
.beeper-nub {
	right: 69px;
	background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/VEYrpQldm-s.png');
	background-repeat: no-repeat;
	background-size: 26px 580px;
	background-position: 0 -234px;
	height: 11px;
	position: absolute;
	top: calc(100% - 10px);
	width: 20px;
	left: 50%;
	transform: translateX(-50%);
}
.alerts {
	background: white;
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
	overflow-y: auto;
	overflow-x: hidden;
	width: 100%;
	z-index: 1;
	box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
		0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
}
@media (min-width: 400px) {
	.alerts {
		width: 400px;
	}
}

@media (min-width: 650px) {
	.alerts {
		bottom: 30%;
		right: 200px;
		left: unset;
		transform: translateX(0);
	}
}
</style>