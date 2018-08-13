'use strict';

import axios from 'axios';

const CHAT_URL = (process.env.NODE_ENV !== 'development') ? '/chat' : '//localhost:3000/chat';

function getChatHistory(userId, thisUserId) {
    return axios.post(`${CHAT_URL}`, { userId, thisUserId })
        .then(res => res.data)
        .catch(err => {
            console.warn(`Had a problem to load chat history`);
            console.log(err);
            return err;
        });
}

function markRead(ids, userId, friendId) {
    console.log(userId);
    console.log(friendId);

    return axios.put(`${CHAT_URL}`, { ids, userId, friendId })
        .then(res => res.data)
}

function loadChatList(userId) {
    return axios.put(`${CHAT_URL}/chat_list`, { userId })
        .then(res => res.data)
}

export default {
    getChatHistory,
    markRead,
    loadChatList
}