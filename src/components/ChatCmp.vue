<template>
	<div>
		<!-- <button @click="test">test</button> -->
		<beautiful-chat ref="chat" :colors="color" :agentProfile="agentProfile" :showTypingIndicator="isTyping" :onMessageWasSent="onMessageWasSent" :messageList="messageList" :newMessagesCount="newMessagesCount" :isOpen="isChatOpen" :close="closeChat" :open="openChat" :showEmoji="true" :showFile="true" />
		</beautiful-chat>
	</div>

</template>

<script>
import { GET_CHAT_HISTORY } from '@/modules/JesteModule';
import { USER_GET_BY_ID } from '@/modules/UserModule';

export default {
	props: ['jesteId', 'userId', 'reqUserId', 'resUserId'],
	sockets: {
		receivedMsg({ msg }) {
			console.log('this message was recived', msg);
			if (msg) this.handleReceivedMsg(msg);
		},
		isTyping() {
			if (this.typingTimout) clearTimeout(this.typingTimeout);
			this.isTyping = true;
			setTimeout(_ => {
				this.isTyping = false;
			}, 1500);
		}
	},
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
			agentProfile: {
				teamName: 'Vue Beautiful Chat',
				imageUrl:
					'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
			},
			messageList: [],
			newMessagesCount: 0,
			isChatOpen: false,
			isTyping: false,
			typingTimeout: null
		};
	},
	created() {
		console.log('requserid', this.reqUserId);
		console.log('Res User', this.resUserId);

		if (this.userId === this.reqUserId) {
			this.getUser(this.resUserId);
		} else {
			this.getUser(this.reqUserId);
		}
		this.$store.dispatch({ type: GET_CHAT_HISTORY, jesteId: this.jesteId })
			.then(res => {
				console.log('chat res:', res);

				var orderHistory = res.reduce((acc, item) => {
					if (item.msg.authorId === this.userId) {
						item.msg.author = 'me';
					} else {
						item.msg.author = 'them';
					}
					acc.push(item.msg);
					return acc;
				}, []);
				this.messageList = orderHistory;
			});
	},
	mounted() {
		var txtInput = document.querySelector('.sc-user-input--text');
		let _this = this;

		txtInput.addEventListener('input', function() {
			_this.handleTyping();
		});
	},
	methods: {
		handleReceivedMsg(msg) {
			msg.author = 'them';
			if (msg.data.file || msg.data.emoji || msg.data.text.length > 0) {
				this.newMessagesCount = this.isChatOpen
					? this.newMessagesCount
					: this.newMessagesCount + 1;
				this.isTyping = false;
				this.messageList.push(msg);
				console.log('send');
			}
		},
		onMessageWasSent(msg) {
			msg.timestamp = Date.now();
			this.messageList.push(msg);
			msg.authorId = this.userId;

			this.$socket.emit('sendMsg', { msg, jesteId: this.jesteId });

			console.log('msg', msg);
		},
		openChat() {
			this.isChatOpen = true;
			this.newMessagesCount = 0;
		},
		closeChat() {
			this.isChatOpen = false;
		},
		handleTyping() {
			this.$socket.emit('isTyping', { jesteId: this.jesteId });
		},
		getUser(id) {
			console.log('method id', id);

			this.$store.dispatch({ type: USER_GET_BY_ID, id }).then(user => {
				this.agentProfile.teamName =
					user.details.firstName + ' ' + user.details.lastName;
				this.agentProfile.imageUrl = user.img.url;
			});
		}
	}
};
</script>


<style  lang="scss">
img.sc-header--img {
	width: 54px !important;
	height: 54px !important;
}
.sc-message--avatar {
	    background-size: 30px 30px !important;
	// display: none
}
.sc-message--content.received .sc-message--text {
	    max-width: calc(100% - 120px);
    word-wrap: break-word;
}


</style>
