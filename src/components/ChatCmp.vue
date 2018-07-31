<template>
	<div>
		<!-- <button @click="test">test</button> -->
		<beautiful-chat :colors="color" :agentProfile="agentProfile" :onMessageWasSent="onMessageWasSent" :messageList="messageList" :newMessagesCount="newMessagesCount" :isOpen="isChatOpen" :close="closeChat" :open="openChat" :showEmoji="true" :showFile="true" />
		</beautiful-chat>
	</div>

</template>

<script>
export default {
	props: ['reqUserId', 'currUser'],
	sockets: {
		elad() {
			console.log('ela os the cmp');
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
			isChatOpen: true,
			sockets: {
				connect: function() {
					console.log('socket connected');
				},
				customEmit: function(val) {
					console.log(
						'this method was fired by the socket server. eg: io.emit("customEmit", data)'
					);
				}
			}
		};
	},
	created() {
		console.log('this chat user', this.currUser);
		
		this.$socket.emit('roomRequested', {user: this.currUser, req_user_id: this.reqUserId});


	},
	methods: {
		sendMessage(msg) {
			if (msg.data.text.length > 0) {
				this.newMessagesCount = this.isChatOpen
					? this.newMessagesCount
					: this.newMessagesCount + 1;
				this.messageList.push(msg);
				console.log('send');
			}
		},
		onMessageWasSent(msg) {
			this.messageList.push(msg);
			console.log('msg', msg);
		},
		openChat() {
			this.isChatOpen = true;
			this.newMessagesCount = 0;
		},
		closeChat() {
			this.isChatOpen = false;
		},
		test() {
			this.sendMessage({
				author: 'them',
				type: 'text',
				data: {
					text:
						'somaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaae text'
				}
			});
		}
	}
};
</script>

<style>
</style>
