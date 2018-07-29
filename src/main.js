import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';
import './registerServiceWorker';
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

 
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyB1XEp2JKq8CAO8EbBSDGEvjrVC264DLPA' 
});
Vue.use(Vuetify)

axios.defaults.withCredentials = true
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');