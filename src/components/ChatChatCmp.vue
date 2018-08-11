<template>
	<div class="chat-cmp">
		<beautiful-chat ref="chat" :colors="color" :agentProfile="agentProfile" :showTypingIndicator="isTyping" :onMessageWasSent="onMessageWasSent" :messageList="messageList" :newMessagesCount="newMessagesCount" :isOpen="isChatOpen" :close="closeChat" :open="openChat" :showEmoji="true" :showFile="true" />
		</beautiful-chat>



	</div>
</template>

<script>
import ChatService from '@/services/ChatService';

import {
	GET_MESSAGE_LIST,
	GET_NEW_MESSAGES_COUNT,
	GET_IS_CHAT_OPEN,
	GET_IS_TYPING,
	UPDATE_CHAT_STATE,
	GET_CURR_USER_ID,
	CHAT_MARK_READ,
	SEND_MSG,
	GET_AGENT_PROFILE
} from '@/modules/ChatModule';
import { USER_GET_BY_ID, USER_CONNECTED } from '@/modules/UserModule';

export default {
	data() {
		return {
			color: {
				header: {
					bg: '#4e8cff',
					text: '#ffffff'
				},
				launcher: {
					bg: '#4e8cff'
				},
				messageList: {
					bg: '#ffffff'
				},
				sentMessage: {
					bg: '#4e8cff',
					text: '#ffffff'
				},
				receivedMessage: {
					bg: '#eaeaea',
					text: '#222222'
				},
				userInput: {
					bg: '#f4f7f9',
					text: '#565867'
				}
			},
			// agentProfile: {
			// 	teamName: 'Vue Beautiful Chat',
			// 	imageUrl:
			// 		'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
			// },

			typingTimeout: null
		};
	},
	created() {},
	mounted() {
		var txtInput = document.querySelector('.sc-user-input--text');
		let _this = this;
		txtInput.addEventListener('input', function() {
			_this.handleTyping();
		});
	},
	methods: {
		onMessageWasSent(msg) {
			msg.timestamp = Date.now();
			msg.fromUserId = this.mainUserId;
			msg.toUserId = this.currUserId;
			msg.isRead = false;
			this.$store.commit({ type: SEND_MSG, msg });

			this.$socket.emit('sendMsg', msg);
		},
		openChat() {
			this.$store.commit({ type: UPDATE_CHAT_STATE, isOpen: true });
			this.$store.dispatch({ type: CHAT_MARK_READ });
		},
		closeChat() {
			this.$store.commit({ type: UPDATE_CHAT_STATE, isOpen: false });
		},
		handleTyping() {
			this.$socket.emit('isTyping', {
				fromUserId: this.mainUserId,
				toUserId: this.currUserId
			});
		},
		getUser(id) {
			this.$store.dispatch({ type: USER_GET_BY_ID, id }).then(user => {
				this.agentProfile.teamName =
					user.details.firstName + ' ' + user.details.lastName;
				this.agentProfile.imageUrl = user.img.url;
			});
		}
	},
	computed: {
		messageList() {
			return this.$store.getters[GET_MESSAGE_LIST];
		},
		newMessagesCount() {
			return this.$store.getters[GET_NEW_MESSAGES_COUNT];
		},
		isChatOpen() {
			return this.$store.getters[GET_IS_CHAT_OPEN];
		},
		isTyping() {
			return this.$store.getters[GET_IS_TYPING];
		},
		mainUserId() {
			return this.$store.getters[USER_CONNECTED]._id;
		},
		currUserId() {
			return this.$store.getters[GET_CURR_USER_ID];
		},
		agentProfile() {
			return this.$store.getters[GET_AGENT_PROFILE];
		}
	}
};
</script>

<style  lang="scss">
.chat-cmp {
	position: relative;
	z-index: 3
}
img.sc-header--img {
	width: 54px !important;
	height: 54px !important;
}
.sc-message--avatar {
	background-size: 30px 30px !important;
}
.sc-message--content.received .sc-message--text {
	max-width: calc(100% - 120px);
	word-wrap: break-word;
}
.sc-launcher,
.sc-launcher .sc-open-icon, .sc-launcher .sc-closed-icon {
	right: 80px !important;
	bottom: 16px !important;
	height: 56px !important;
	width: 56px !important;

}
</style>
