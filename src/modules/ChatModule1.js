'use strict';
import ChatService from '@/services/ChatService';
import UserService from '@/services/UserService';

export const SET_CHAT_HISTORY = 'chat/mutations/setChatHistory';
export const OPEN_CHAT = 'chat/mutations/openChat';
export const SET_CHAT = 'chat/mutations/setChat';
export const UPDATE_CHAT_STATE = 'chat/mutations/updateChatState';
export const SET_CHAT_USER = 'chat/mutations/setChatUser';
export const ADD_MSG = 'chat/mutations/addMsg';

export const GET_CHAT_HISTORY = 'chat/actions/getChatHistory';
export const MARK_READ = 'chat/actions/markRead';
export const LOAD_CHAT_LIST = 'chat/actions/loadChatList';

export const GET_MESSAGE_LIST = 'chat/getters/getMessageList';
export const GET_CURR_USER_ID = 'chat/getters/getCurrUserId';
export const GET_NEW_MESSAGES_COUNT = 'chat/getters/getNewMessagesCount';
export const GET_IS_CHAT_OPEN = 'chat/getters/getIsChatOpen';
export const GET_IS_TYPING = 'chat/getters/getIsTyping';
export const IS_CHAT = 'chat/getters/isChat';

import { USER_CONNECTED } from './UserModule';

export default {
	state: {
		currMessageList: [],
		isChatOpen: false,
		isTyping: false,
		isChat: false,
		currUserId: null,
        currUser: null,
		typingTimeout: null,
		chatList: null
	},
	getters: {
		[GET_MESSAGE_LIST](state) {
			return state.currMessageList;
		},
		[GET_NEW_MESSAGES_COUNT](state) {
            var count = 0; 
            let messageList = state.currMessageList
            // debugger;
            for (let i = 0; i< messageList.length; i++){
                if (messageList[i].fromUserId === state.currUserId && !messageList[i].isRead) {
                    count ++
                }
        

            }
            console.log('count is', count)
			return count;
			// return state.newMessagesCount;
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
		
	},
	mutations: {
		[LOAD_CHAT_LIST](state, {chatList}) {
			state.chatList = chatList
		},
		[SET_CHAT_HISTORY](state, { chatHistory }) {
			var orderHistory = chatHistory.reduce((acc, item) => {
				if (item.fromUserId === state.currUserId) item.author = 'them';
				else item.author = 'me';
				acc.push(item);
				return acc;
			}, []);
			state.currMessageList = orderHistory;
		},
		[SET_CHAT](state, { userId}) {

			state.currUserId = userId;
			state.isChat = true;
		},
		[UPDATE_CHAT_STATE](state, { isOpen }) {
			state.isChatOpen = isOpen;
		},
		[SET_CHAT_USER](state, { user }) {
			state.currUser = user;
        },
        [MARK_READ](state) {
            state.currMessageList.forEach(msg => {
                if(!msg.isRead && msg.fromUserId === state.currUserId) {
                    msg.isRead = true
                }
                
            });

        },
        [ADD_MSG](state, {msg}){
            clearTimeout(state.typingTimeout)
            state.currMessageList.push(msg)
        },
        SOCKET_CONNECT(state) {
            console.log('socket connected');
            

        },
        SOCKET_ISTYPING(state, {fromUserId}) {
            if(fromUserId === state.currUserId) {
                if (state.typingTimout) clearTimeout(state.typingTimeout);
                state.isTyping = true;
                state.typingTimeout = setTimeout(_ => {
                    state.isTyping = false;
                }, 1500);

            }    
        }
	},
	actions: {
		[LOAD_CHAT_LIST](context) {
			var thisUserId = context.getters[USER_CONNECTED]._id;

			ChatService.loadChatList(thisUserId)
			.then(chatList => context.commit({type: LOAD_CHAT_LIST, chatList}))
		},
		[GET_CHAT_HISTORY](context, { userId }) {
			var thisUserId = context.getters[USER_CONNECTED]._id;
			return ChatService.getChatHistory(userId, thisUserId)
				.then(chatHistory => {
                    console.log('history is', chatHistory);
                    
					context.commit({ type: SET_CHAT_HISTORY, chatHistory });
				})
				.catch(err => err);
		},
		[SET_CHAT_USER](context, { userId }) {
			return UserService.getUserByID(userId).then(user => {
				context.commit({ type: SET_CHAT_USER, user });
			});
        },
        [MARK_READ](context) {
            var messageList = context.state.currMessageList
            var currUserId = context.state.currUserId 
            var ids = messageList.reduce((acc, msg) =>{

                if (msg.fromUserId === currUserId && !msg.isRead) {
                    acc.push(msg._id)
                }
                return acc

            }, [])
            if (ids.length > 0) {
                ChatService.markRead(ids, context.getters[USER_CONNECTED]._id, context.state.currUserId)
                .then(_ => {
                    context.commit({type: MARK_READ})

                })

            }

        },
		socket_receivedMsg(context, msg) {
            if(context.state.currUserId === msg.fromUserId && context.state.isChatOpen) {
				console.log('isoprn');
				
                msg.isRead = true
                ChatService.markRead([msg._id], context.getters[USER_CONNECTED]._id, context.state.currUserId)
            }
            context.commit({type: ADD_MSG, msg})
		}
	}
};
