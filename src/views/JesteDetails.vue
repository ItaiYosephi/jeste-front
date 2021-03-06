<template>
	<v-container fluid grid-list-md>
		<v-layout row wrap fill-height v-if="jeste">

			<v-flex xs12 v-if="jeste.status === 3">
				<v-card hover>
					<v-toolbar color="success" class="white--text" flat>
						<v-toolbar-title>
							<v-icon class="white--text">done</v-icon> Jeste Completed!</v-toolbar-title>
					</v-toolbar>
				</v-card>
			</v-flex>

			<v-flex xs12 v-if="user && canEdit && jeste.status >= 1 && jeste.res_user_id && resUser ">
				<v-card hover>
					<v-toolbar color="primary" class="white--text" flat>
						<v-toolbar-title v-if="jeste.status === 1">Confirm Respond</v-toolbar-title>
						<v-toolbar-title v-if="jeste.status === 2">Awaiting Completion</v-toolbar-title>
					</v-toolbar>
					<v-card-text class="confirm-text-wrapper">
						<Profile :user="resUser" />
						<v-spacer></v-spacer>
						<div class="btn-wrapper">
							<v-btn color="info" small @click="setChat(resUser._id)">
								<v-icon>message</v-icon>
							</v-btn>
							<template v-if="jeste.status === 1">
								<v-btn color="error" small @click="rejectRespond">
									<v-icon>close</v-icon>
								</v-btn>
								<v-btn color="success" small @click="acceptRespond">
									<v-icon>done</v-icon>
								</v-btn>
							</template>
							<v-btn color="success" small @click="completeJeste" v-if="jeste.status === 2">
								<v-icon>done_outline</v-icon>
							</v-btn>
						</div>
					</v-card-text>
					<v-divider></v-divider>
				</v-card>
			</v-flex>

			<v-flex xs12 sm6>

				<v-card height="100%" class="jeste-details-card" hover>
					<div class="load-wrapper" v-if="isLoading">
						<LoadingCmp/>
					</div>
					<v-toolbar v-if="!isLoading" color="primary" class="white--text" flat>
						<v-toolbar-title>{{jeste.title}}</v-toolbar-title>
					</v-toolbar>
					<v-card-title v-if="!isLoading" primary-title>
						<v-layout row justify-space-between>
							<v-flex>
								<div class="secondary--text mb-2">{{jeste.created_at | dateFormat}}</div>
								<div class="desc">{{jeste.description}}</div>
								
							</v-flex>
							<v-flex v-if="reqUser" xs2 ml-4>
								<Profile :user="reqUser" />
							</v-flex>
						</v-layout>
														<div class="secondary--text">{{jeste.formatted_address}}</div>

					</v-card-title>
					
					<v-card-actions v-if="!isLoading" class="actions">
						<v-btn v-if="canEdit" flat color="green" :to="`/jeste/${jeste._id}/edit`">Edit</v-btn>
						<v-btn v-if="canEdit" flat color="error" @click.stop="dialog = true">Delete</v-btn>
						<v-btn v-if="user && user._id !== jeste.req_user_id" flat color="info" @click.stop="setChat(reqUser._id)">
							Send Message
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn v-if="!canEdit && user && !jeste.res_user_id" outline color="blue" @click.prevent="respond">Jeste It!</v-btn>
					</v-card-actions>

				</v-card>
			</v-flex>

			<v-flex xs12 sm6>
				<v-card hover height="100%">
					<div class="load-wrapper" v-if="isLoading">
						<LoadingCmp/>
					</div>
					<v-card-media v-else-if="jeste.img" :src="jeste.img.secure_url" height="400px">
					</v-card-media>
				</v-card>
			</v-flex>

			<v-flex xs12>
				<v-card hover>
					<v-card-text>
						<GmapMap :center="position" v-if="jeste.destination_loc" :zoom="15" map-type-id="terrain" style="width: 100%; height: 300px">
							<GmapMarker :position="position" :clickable="false" :draggable="true" @click="center=position" />
						</GmapMap>
					</v-card-text>
				</v-card>
			</v-flex>

			<v-dialog v-model="dialog" max-width="400" class="warning">
				<v-card>
					<v-card-title class="headline grey lighten-2">Are you sure?</v-card-title>
					<v-card-text>
						Once deleted, there's no way back...
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn color="green darken-1" flat @click="dialog = false">
							Cancel
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn color="error" flat @click="deleteJeste()">
							Delete
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

		</v-layout>
	</v-container>
</template>

<script>
import ChatCmp from '@/components/ChatCmp';
import Profile from '@/components/users/Profile';
import LoadingCmp from '@/components/LoadingCmp';

import { EventBus, SNACK_MSG, SET_CHAT } from '@/services/EventBusService';
import {
	JESTE_GET,
	JESTE_GET_BY_ID,
	JESTE_DELETE,
	JESTE_IS_LOADING
} from '@/modules/JesteModule';
import {
	USER_CONNECTED,
	USER_GET_BY_ID,
	GET_NOTIFICATIONS
} from '@/modules/UserModule';
import { UPDATE_TITLE } from '@/store';

export default {
	name: 'jesteDetails',
	components: {
		ChatCmp,
		Profile,
		LoadingCmp
	},
	created() {
		this.getJeste()
			.then(this.getReqUser)
			.then(this.getResUser);
		this.$store.commit({ type: UPDATE_TITLE, title: 'Jeste - Details' });
	},
	data() {
		return {
			jeste: {},
			dialog: false,
			reqUser: null,
			resUser: null
		};
	},
	computed: {
		isLoading() {
			return this.$store.getters[JESTE_IS_LOADING];
		},
		position() {
			if (this.jeste.destination_loc) {
				return {
					lat: +this.jeste.destination_loc.coordinates[0],
					lng: +this.jeste.destination_loc.coordinates[1]
				};
			}
		},
		canEdit() {
			return (
				!this.jeste.ended_at &&
				this.user &&
				this.user._id === this.jeste.req_user_id
			);
		},
		user() {
			return this.$store.getters[USER_CONNECTED];
		},
		notifications() {
			return this.$store.getters[GET_NOTIFICATIONS];
		}
	},
	methods: {
		getJeste() {
			return this.$store
				.dispatch({ type: JESTE_GET_BY_ID, id: this.$route.params.id })
				.then(jeste => (this.jeste = jeste));
		},
		deleteJeste() {
			this.dialog = false;
			this.$store
				.dispatch({ type: JESTE_DELETE, id: this.jeste._id })
				.then(_ => {
					EventBus.$emit(SNACK_MSG, {
						text: `Jeste Deleted Successfully`,
						bgColor: 'success'
					});
					this.$router.push('/');
				});
		},
		respond() {
			this.jeste.status = 1;
			this.jeste.res_user_id = this.user._id;
			this.$socket.emit('jesteResponded', {
				jeste: this.jeste,
				user: this.user
			});
		},
		getReqUser() {
			return this.$store
				.dispatch({ type: USER_GET_BY_ID, id: this.jeste.req_user_id })
				.then(user => (this.reqUser = user));
		},
		getResUser() {
			if (!this.canEdit || !this.jeste.res_user_id) return;
			return this.$store
				.dispatch({ type: USER_GET_BY_ID, id: this.jeste.res_user_id })
				.then(user => (this.resUser = user));
		},
		acceptRespond() {
			this.jeste.status = 2;
			this.$socket.emit('acceptRespond', {
				jeste: this.jeste,
				user: this.user
			});
		},
		rejectRespond() {
			this.jeste.status = 0;
			this.$socket.emit('rejectRespond', {
				jeste: this.jeste,
				user: this.user
			});
		},
		setChat(userId) {
			EventBus.$emit(SET_CHAT, userId);
		},
		completeJeste() {
			this.jeste.status = 3;
			this.jeste.ended_at = Date.now();
			this.$socket.emit('jesteCompleted', {
				jeste: this.jeste,
				user: this.user
			});
		}
	},
	sockets: {
		receivedNotification(notification) {
			if (notification.jesteId === this.jeste._id) {
				this.$router.go(this.$router.currentRoute);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/_vars.scss';
.desc {
	white-space: pre-line;
	text-indent: 0;
}

a {
	text-decoration: none;
}
.v-card--hover {
	cursor: default;
}
.jeste-details-card {
	display: flex;
	flex-direction: column;
}

.load-wrapper {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px;
}

.v-card__actions {
	margin-top: auto;
}
.v-card__actions .v-btn + .v-btn {
	margin-left: 0;
}

.confirm-text-wrapper {
	display: flex;
	flex-flow: column wrap;
	justify-content: space-between;
	@media (min-width: 800px) {
		flex-flow: row wrap;
	}
}

.btn-wrapper {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
	button {
		margin: 3px;
		max-width: 80px;
	}
	@media (min-width: 800px) {
		justify-content: center;
		flex-direction: column;
	}
}
</style>