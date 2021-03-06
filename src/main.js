import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import Chat from 'vue-beautiful-chat';
import 'default-passive-events';
import * as VueGoogleMaps from 'vue2-google-maps';
import moment from 'moment';

import VueAgile from 'vue-agile'

Vue.use(VueAgile)

// const GOOGLE_API_KEY = 'AIzaSyB1XEp2JKq8CAO8EbBSDGEvjrVC264DLPA';

// The KEY for the presenation
const GOOGLE_API_KEY = 'AIzaSyCZOyBJ2lwOryc-T9uNmd8oX3ueHMS4Gh4';

import VueSocketio from 'vue-socket.io-extended';

import io from 'socket.io-client';
import './assets/styles/main.scss';

// const SOCKET_URL = 'https://tranquil-headland-25582.herokuapp.com'
const SOCKET_URL = process.env.NODE_ENV !== 'development' ? '/' : '//localhost:3000';

Vue.use(VueSocketio, io(SOCKET_URL), { store });

Vue.use(VueGoogleMaps, {
	load: {
		key: GOOGLE_API_KEY,
		libraries: 'places' // This is required if you use the Autocomplete plugin
	}
});

Vue.use(Vuetify, {
	theme: {
		primary: '#039BE5',
		secondary: '#031424',
		accent: '#424242',
		text: '#fff',
		bg: '#e9e9e9',
		error: '#f44336',
		warning: '#ffeb3b',
		info: '#2196f3',
		success: '#4caf50'
	}
});
Vue.use(Chat);

axios.defaults.withCredentials = true;
Vue.config.productionTip = false;

Vue.directive('title', {
	inserted: (el, binding) => (document.title = binding.value),
	update: (el, binding) => (document.title = binding.value)
});

Vue.filter('dateFormat', function(timestamp) {
	if (!timestamp) return '';
	return moment(timestamp).fromNow(); // 6 years ago
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
