import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import * as VueGoogleMaps from 'vue2-google-maps';
const GOOGLE_API_KEY = 'AIzaSyB1XEp2JKq8CAO8EbBSDGEvjrVC264DLPA';

Vue.use(VueGoogleMaps, {
	load: {
		key: GOOGLE_API_KEY,
		libraries: 'places' // This is required if you use the Autocomplete plugin
	}
});

Vue.use(Vuetify, {
	theme: {
		primary: "#039BE5",
		secondary: "#031424",
		accent: "#424242",
		text: '#fff',
		bg: "#e9e9e9",
		error: "#f44336",
		warning: "#ffeb3b",
		info: "#2196f3",
		success: "#4caf50"
	}
})

axios.defaults.withCredentials = true;
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
