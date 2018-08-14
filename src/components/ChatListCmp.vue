<template>
	<v-list two-line>
		<v-subheader>
			Chats
		</v-subheader>
		<template v-for="(item, index) in chatList">

			<v-list-tile :key="item.friendId" avatar @click="setChat(item.friendId)" :class="item.unReadCount > 0 ? 'not-read' : ''">
				<v-list-tile-avatar>
					<img :src="item.chatUser.img.secure_url">
				</v-list-tile-avatar>

				<v-list-tile-content>
					<v-list-tile-title>{{item.chatUser.details.firstName}} {{item.chatUser.details.lastName}}
						<span v-if="item.unReadCount > 0">({{item.unReadCount}})</span>
					</v-list-tile-title>
					<v-list-tile-sub-title>{{item.txt}}</v-list-tile-sub-title>
					<v-list-tile-sub-title>{{item.timestamp | dateFormat}}</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
			<v-divider :inset="true" v-if="index !== chatList.length - 1"></v-divider>

		</template>
	</v-list>
</template>

<script>

import { EventBus, SET_CHAT } from '@/services/EventBusService';
export default {
	props: ['chatList'],
	data() {
		return {};
	},
	methods: {
		setChat(userId) {
			this.$emit('close-list');
			EventBus.$emit(SET_CHAT, userId);
		}
	}
};
</script>

<style scoped>
.not-read {
	background: #edf2fa;
}
/* .chat-list {
	background: white;
	position: fixed;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	max-width: 100%;
}

@media (min-width: 350px) {
	.chat-list {
		min-width: 350px;
	}
}

@media (min-width: 650px) {
	.chat-list {
		right: 200px;
		left: unset;
		transform: translateX(0);
	}
} */
</style>
