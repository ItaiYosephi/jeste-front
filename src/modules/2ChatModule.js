'use strict';
import ChatService from '@/services/ChatService';
import UserService from '@/services/UserService';

export const OPEN_CHAT = 'chat/mutations/openChat';
export const SET_CHAT = 'chat/mutations/setChat';
export const UPDATE_CHAT_STATE = 'chat/mutations/updateChatState';
export const SET_CHAT_USER = 'chat/mutations/setChatUser';
export const ADD_MSG = 'chat/mutations/addMsg';
export const SET_MESSAGE_LIST = 'chat/mutations/setMessageList';
export const SET_CURR_MESSAGE_LIST = 'chat/mutations/setCurrMessageList';
export const ADD_TO_CHAT_LIST = 'chat/mutations/addToChatList';
export const CLOSE_CHAT = 'chat/mutations/closeChat';
export const SEND_MSG = 'chat/mutations/sendMsg';

export const GET_CHAT_HISTORY = 'chat/actions/getChatHistory';
export const MARK_READ = 'chat/actions/markRead';
export const LOAD_CHAT_LIST = 'chat/actions/loadChatList';
export const SET_CURR_CHAT = 'chat/mutation/setCurrChat';

export const GET_MESSAGE_LIST = 'chat/getters/getMessageList';
export const GET_CURR_USER_ID = 'chat/getters/getCurrUserId';
export const GET_NEW_MESSAGES_COUNT = 'chat/getters/getNewMessagesCount';
export const GET_IS_CHAT_OPEN = 'chat/getters/getIsChatOpen';
export const GET_IS_TYPING = 'chat/getters/getIsTyping';
export const IS_CHAT = 'chat/getters/isChat';
export const CHAT_LIST_MAP = 'chat/getters/chatListMap';
export const GET_CHAT_LIST = 'chat/getters/getChatList';

import { USER_CONNECTED } from './UserModule';

export default {
	state: {
		currMessageList: [],
		isChatOpen: false,
		isTyping: false,
		isChat: false,
		currUserId: null,
		typingTimeout: null,
		chatList: null,
		currChat: null
	},
	getters: {
		[GET_CHAT_LIST](state) {
			let chatList = [];
			if (state.chatList) {
				chatList = state.chatList.sort((a, b) => {
					return b.timestamp - a.timestamp;
				});
			}

			return chatList;
		},
		[GET_MESSAGE_LIST](state) {
			return state.currMessageList;
		},
		[GET_NEW_MESSAGES_COUNT](state) {
			var count = 0;
			let messageList = state.currMessageList;
			for (let i = 0; i < messageList.length; i++) {
				if (
					messageList[i].fromUserId === state.currUserId &&
					!messageList[i].isRead
				) {
					count++;
				}
			}
			return count;
		},
		[GET_IS_CHAT_OPEN](state) {
			return state.isChatOpen;
		},
		[GET_IS_TYPING](state) {
			return state.isTyping;
		},
		[IS_CHAT](state) {
			return state.isChat;
		},
		[GET_CURR_USER_ID](state) {
			return state.currUserId;
		},
		[CHAT_LIST_MAP](state) {
			var map = {};
			if (state.chatList) {
				state.chatList.forEach(item => {
					map[item.friendId] = item;
				});
			}

			return map;
		},

	},
	mutations: {
		[LOAD_CHAT_LIST](state, { chatList }) {
			chatList.forEach(item => (item.messageList = null));
			state.chatList = chatList;
		},
		[SET_CHAT](state, { userId }) {
			state.isChatOpen = false;
			state.currUserId = userId;
			state.isChat = true;
		},
		[UPDATE_CHAT_STATE](state, { isOpen }) {
			state.isChatOpen = isOpen;
		},
		[MARK_READ](state) {
			state.currChat.unReadCount = 0;
			state.currMessageList.forEach(msg => {
				if (!msg.isRead && msg.fromUserId === state.currUserId) {
					msg.isRead = true;
				}
			});
		},
		[ADD_MSG](state, { msg, chatItem }) {
			if (chatItem) {
				console.log('chatItem', chatItem);
				chatItem.timestamp = msg.timestamp
				chatItem.unReadCount++
				chatItem.txt = (msg.data.text)? msg.data.text.substring(0, 100): msg.data.emoji
				chatItem.messageList.push(msg);
			} else {
				state.currChat.unReadCount++

				state.currChat.timestamp = msg.timestamp
				state.currChat.txt = (msg.data.text)? msg.data.text.substring(0, 100): msg.data.emoji
				clearTimeout(state.typingTimeout);
				state.isTyping = false;
				state.currMessageList.push(msg);
			}
		},
		[CLOSE_CHAT](state) {
			state.isChatOpen = false;
			state.isChat = false;
			state.currUserId = null;
			state.currChat = null;
		},
		[SEND_MSG](state, {msg}) {
			state.currMessageList.push(msg)
			state.currChat.timestamp = msg.timestamp
			state.currChat.txt = (msg.data.text)? msg.data.text.substring(0, 100): msg.data.emoji
		},
		SOCKET_CONNECT(state) {
			console.log('socket connected');
		},
		SOCKET_ISTYPING(state, { fromUserId }) {
			if (fromUserId === state.currUserId) {
				if (state.typingTimout) clearTimeout(state.typingTimeout);
				state.isTyping = true;
				state.typingTimeout = setTimeout(_ => {
					state.isTyping = false;
				}, 1500);
			}
		},
		[SET_CURR_CHAT](state, { chatItem }) {
			state.currChat = chatItem;
		},
		[SET_CURR_MESSAGE_LIST](state) {
			state.currMessageList = state.currChat.messageList;
		},
		[SET_MESSAGE_LIST](state, { chatHistory, chatItem, msg }) {
			var messageList = chatHistory.reduce((acc, item) => {
				if (item.fromUserId === state.currUserId) item.author = 'them';
				else item.author = 'me';
				acc.push(item);
				return acc;
			}, []);
			if (msg &&msg.timestamp > messageList[messageList.length -1].timestamp) {
				msg.author = 'them'
				messageList.push(msg)
			}
			if (chatItem) {
				console.log('SET MESS LIST');
				chatItem.timestamp = messageList[messageList.length -1].timestamp
				// chatItem.timestamp =
				chatItem.messageList = messageList;
				chatItem.unReadCount++;
				chatItem.txt = ( msg.data.text) ? msg.data.text.substring(0, 100): msg.data.emoji
			} else {
				state.currChat.messageList = messageList;
			}
		},
		[ADD_TO_CHAT_LIST](state, { chatItem }) {
			state.chatList.push(chatItem);
		}
	},
	actions: {
		[LOAD_CHAT_LIST](context) {
			var thisUserId = context.getters[USER_CONNECTED]._id;

			ChatService.loadChatList(thisUserId).then(chatList =>
				context.commit({ type: LOAD_CHAT_LIST, chatList })
			);
		},
		[GET_CHAT_HISTORY](context, payload) {
			var userId;
			if (payload && payload.userId) userId = payload.userId;
			else userId = context.state.currUserId;
			console.log('this is use rid', userId);

			var thisUserId = context.getters[USER_CONNECTED]._id;
			return ChatService.getChatHistory(userId, thisUserId)
				.then(chatHistory => {
					console.log('history is', chatHistory);

					return chatHistory;
				})
				.catch(err => err);
		},
		[SET_CHAT_USER](context, { userId }) {
			if (userId === context.state.currUserId) {
				context.commit(CLOSE_CHAT);
			} else {
				context.commit({ type: SET_CHAT, userId });
				var chatItem = context.getters[CHAT_LIST_MAP][userId];
				if (chatItem) {
					context.commit({ type: SET_CURR_CHAT, chatItem });
					if (chatItem.messageList) {
						console.log('test2');

						context.commit(SET_CURR_MESSAGE_LIST); //done
					} else {
						console.log('test');

						context.dispatch(GET_CHAT_HISTORY).then(chatHistory => {
							context.commit({
								type: SET_MESSAGE_LIST,
								chatHistory
							});
							context.commit(SET_CURR_MESSAGE_LIST); //done
						});
					}
				} else {
					UserService.getUserByID(userId).then(user => {
						user = user[0];
						var chatItem = {
							timestamp: null,
							unReadCount: 0,
							chatUser: user,
							messageList: null,
							friendId: user._id
						};
						context.commit({ type: ADD_TO_CHAT_LIST, chatItem });
						context.commit({ type: SET_CURR_CHAT, chatItem });
						console.log('got here', context.state.currUserId);
						context
							.dispatch({ type: GET_CHAT_HISTORY })
							.then(chatHistory => {
								context.commit({
									type: SET_MESSAGE_LIST,
									chatHistory
								});
								context.commit(SET_CURR_MESSAGE_LIST); //done
							});
					});
				}
			}
		},
		[MARK_READ](context) {
			var messageList = context.state.currMessageList;
			var currUserId = context.state.currUserId;

			var ids = messageList.reduce((acc, msg) => {
				if (msg.fromUserId === currUserId && !msg.isRead) {
					acc.push(msg._id);
				}
				return acc;
			}, []);
			if (ids.length > 0) {
				ChatService.markRead(
					ids,
					context.getters[USER_CONNECTED]._id,
					context.state.currUserId
				).then(_ => {
					context.commit({ type: MARK_READ });
				});
			}
		},
		socket_receivedMsg(context, msg) {
			msg.author = 'them';
			if (context.state.currUserId === msg.fromUserId) {
				if (context.state.isChatOpen) {
					msg.isRead = true;
					ChatService.markRead(
						[msg._id],
						context.getters[USER_CONNECTED]._id,
						context.state.currUserId
					);
				}
				context.commit({ type: ADD_MSG, msg });
			} else {
				console.log(msg.fromUserId);
				console.log(context.getters[CHAT_LIST_MAP]);
				var chatItem = context.getters[CHAT_LIST_MAP][msg.fromUserId];
				console.log(chatItem);

				//if user in chat list and history load
				if (chatItem && chatItem.messageList) {
					console.log('History alreay loaded');

					context.commit({ type: ADD_MSG, msg, chatItem });
				} else if (chatItem) {
					console.log('History not loaded', msg);

					context
						.dispatch({
							type: GET_CHAT_HISTORY,
							userId: msg.fromUserId
						})
						.then(chatHistory => {
							context.commit({
								type: SET_MESSAGE_LIST,
								chatHistory,
								chatItem, msg
							});
						});
				} else {
					UserService.getUserByID(msg.fromUserId).then(user => {
						user = user[0];
						console.log('user not in chat list');

						var chatItem = {
							timestamp: msg.timestamp,
							unReadCount: 1,
							chatUser: user,
							messageList: [msg],
							friendId: user._id,
							txt:  (msg.data.text)? msg.data.text.substring(0, 100): msg.data.emoji
						};
						context.commit({ type: ADD_TO_CHAT_LIST, chatItem });
					});
				}
			}
		}
	}
};




