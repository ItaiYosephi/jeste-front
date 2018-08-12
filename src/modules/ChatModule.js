'use strict';
import ChatService from '@/services/ChatService';
import UserService from '@/services/UserService';
import {
	EventBus,
	SNACK_MSG,
} from '@/services/EventBusService';

export const SET_CHAT = 'chat/mutations/setChat';
export const UPDATE_CHAT_STATE = 'chat/mutations/updateChatState';
export const SET_CHAT_USER = 'chat/mutations/setChatUser';
export const ADD_MSG = 'chat/mutations/addMsg';
export const SET_MESSAGE_LIST = 'chat/mutations/setMessageList';
export const ADD_TO_CHAT_LIST = 'chat/mutations/addToChatList';
export const CLOSE_CHAT = 'chat/mutations/closeChat';
export const SEND_MSG = 'chat/mutations/sendMsg';
export const SET_CURR_CHAT = 'chat/mutation/setCurrChat';

export const GET_CHAT_HISTORY = 'chat/actions/getChatHistory';
export const CHAT_MARK_READ = 'chat/actions/markRead';
export const LOAD_CHAT_LIST = 'chat/actions/loadChatList';
export const GET_CHAT_ITEM = 'chat/actions/getChatItem';
export const SET_CHAT_HISTORY = 'chat/actions/setChatHistory';


export const GET_MESSAGE_LIST = 'chat/getters/getMessageList';
export const GET_AGENT_PROFILE = 'chat/getters/getAgentProfile';
export const GET_CURR_USER_ID = 'chat/getters/getCurrUserId';
export const GET_NEW_MESSAGES_COUNT = 'chat/getters/getNewMessagesCount';
export const GET_IS_CHAT_OPEN = 'chat/getters/getIsChatOpen';
export const GET_IS_TYPING = 'chat/getters/getIsTyping';
export const IS_CHAT = 'chat/getters/isChat';
export const CHAT_LIST_MAP = 'chat/getters/chatListMap';
export const GET_CHAT_LIST = 'chat/getters/getChatList';
export const GET_CHAT_TOTAL_UNREAD = 'chat/getters/getChatTotalUnRead';

import { USER_CONNECTED } from './UserModule';

export default {
	state: {
		currMessageList: [],
		isChatOpen: false,
		isTyping: false,
		isChat: true,
		currUserId: null,
		typingTimeout: null,
		chatList: null,
		currChat: null
	},
	getters: {
		[GET_CHAT_TOTAL_UNREAD] (state) {
			var count = 0
			
			if (state.chatList) {
				
				count = state.chatList.reduce((acc, item) => {
					acc += item.unReadCount
					return acc
				},0)

			}
			

			return count
		},
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
		[GET_AGENT_PROFILE](state) {
			let agentProfile = {teamName: '', imageUrl: ''}
			if  (state.currChat) {
				let chatUser = state.currChat.chatUser;
				agentProfile = {
					teamName: `${chatUser.details.firstName} ${chatUser.details.lastName}`,
					imageUrl: chatUser.img.secure_url
				}

			}
			
			return agentProfile
		}
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
		[CHAT_MARK_READ](state) {
			console.log('commit mark read');
			
			state.currChat.unReadCount = 0;
			state.currMessageList.forEach(msg => {
				if (!msg.isRead && msg.fromUserId === state.currUserId) {
					msg.isRead = true;
				}
			});
		},
		[ADD_MSG](state, { msg}) {

			console.log('adding msg');

			
			if (state.currUserId === msg.fromUserId) {

				state.currChat.timestamp = msg.timestamp;
				state.currChat.txt = msg.data.text
					? msg.data.text.substring(0, 100)
					: msg.data.emoji;
				clearTimeout(state.typingTimeout);
				state.isTyping = false;
				state.currMessageList.push(msg);
				if (!state.isChatOpen) {
					state.currChat.unReadCount++;

				}
				
				
			} else { 
				var chatItem = state.chatList.find(
					item => item.friendId === msg.fromUserId
				);
				console.log('adding msg fount chatitem' ,chatItem);

				chatItem.timestamp = msg.timestamp;
				chatItem.unReadCount++;
				chatItem.txt = msg.data.text
					? msg.data.text.substring(0, 100)
					: msg.data.emoji;

				if (msg.timestamp > chatItem.messageList[chatItem.messageList.length -1].timestamp || chatItem.messageList.length === 0) {
					console.log('inside if');
					
					chatItem.messageList.push(msg);

				}

			}
		},
		[CLOSE_CHAT](state) {
			state.isChatOpen = false;
			state.isChat = false;
			state.currUserId = null;
			state.currChat = null;
		},
		[SEND_MSG](state, { msg }) {
			state.currMessageList.push(msg);
			state.currChat.timestamp = msg.timestamp;
			state.currChat.txt = msg.data.text
				? msg.data.text.substring(0, 100)
				: msg.data.emoji;
		},
		[SET_CURR_CHAT](state, { userId }) {
	

			var chatItem = state.chatList.find(item => {
				
				return item.friendId === userId;
			});
			state.currChat = chatItem;
			
			state.isChatOpen = true;
			state.currMessageList = chatItem.messageList;
		},

		[ADD_TO_CHAT_LIST](state, { chatItem }) {
			state.chatList.push(chatItem);
		},
		[SET_MESSAGE_LIST](state, { userId, messageList }) {
			var chatItem = state.chatList.find(
				item => item.friendId === userId
			);
			var fixedMessageList = messageList.reduce((acc, item) => {
				if (item.fromUserId === userId) item.author = 'them';
				else item.author = 'me';
				acc.push(item);
				return acc;
			}, []);
			chatItem.messageList = fixedMessageList;
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
	},
	actions: {
		[LOAD_CHAT_LIST](context) {
			var thisUserId = context.getters[USER_CONNECTED]._id;

			ChatService.loadChatList(thisUserId).then(chatList =>
				context.commit({ type: LOAD_CHAT_LIST, chatList })
			);
		},
		[SET_CHAT_USER](context, { userId }) {
			if (userId === context.state.currUserId) {
				context.commit(CLOSE_CHAT);
			} else {
				context.commit({ type: SET_CHAT, userId });
				return context
					.dispatch({ type: GET_CHAT_ITEM, userId })
					.then(_ => {

						
						
						context.commit({ type: SET_CURR_CHAT, userId });
						context.dispatch(CHAT_MARK_READ)
						// context.commit(SET_CURR_MESSAGE_LIST); //done
					});
			}
		},
		[GET_CHAT_ITEM](context, { userId }) {
			var chatItem = context.getters[CHAT_LIST_MAP][userId];
			if (chatItem) {
				if (!chatItem.messageList) {
					return context.dispatch({ type: SET_MESSAGE_LIST, userId });
				} else{
					console.log('got chat item');
					
					 return chatItem;
					}
			} else {

				return UserService.getUserByID(userId).then(user => {
					user = user[0];
					var chatItem = {
						timestamp: null,
						unReadCount: 0,
						chatUser: user,
						messageList: null,
						friendId: user._id
					};
					

					context.commit({ type: ADD_TO_CHAT_LIST, chatItem });
					return context.dispatch({ type: SET_MESSAGE_LIST, userId });
				});
			}
		},
		[SET_MESSAGE_LIST](context, { userId }) {
			var thisUserId = context.getters[USER_CONNECTED]._id;
			return ChatService.getChatHistory(userId, thisUserId)
				.then(messageList => {
					context.commit({
						type: SET_MESSAGE_LIST,
						userId,
						messageList
					});
					

					return messageList;
				})
				.catch(err => err);
		},

		[CHAT_MARK_READ](context) {
			console.log('mark read');
			
			var messageList = context.state.currMessageList;
			var currUserId = context.state.currUserId;

			var ids = messageList.reduce((acc, msg) => {
				
				if (msg.fromUserId === currUserId && !msg.isRead) {
					acc.push(msg._id);
				}
				return acc;
			}, []);
			console.log('these are ids', ids);

			if (ids.length > 0) {
				ChatService.markRead(
					ids,
					context.getters[USER_CONNECTED]._id,
					context.state.currUserId
				).then(_ => {
					context.commit({ type: CHAT_MARK_READ });
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
				EventBus.$emit(SNACK_MSG, {
					text: `Someone just sent you a message`,
					// bgColor: '#000'
				});			
				context.dispatch({type: GET_CHAT_ITEM, userId : msg.fromUserId})
				.then(_ => {
					
					context.commit({ type: ADD_MSG, msg });

				})
			}
		}
	}
};

