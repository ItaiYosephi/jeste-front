import Vue from 'vue';
import Router from 'vue-router';
import JesteApp from './views/JesteApp.vue';
import JesteEdit from './views/JesteEdit.vue';
import JesteDetails from './views/JesteDetails.vue';
import Users from './views/Users.vue';
import UserEdit from './views/UserEdit.vue';
import UserDetails from './views/UserDetails.vue';
import About from './views/About.vue';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'home', component: JesteApp },
    { path: '/jeste', name: 'jestes', component: JesteApp },
    { path: '/jeste/:id?/edit', name: 'jesteEdit', component: JesteEdit },
    { path: '/jeste/:id', name: 'jesteDetails', component: JesteDetails, },
    { path: '/user', name: 'users', component: Users },
    { path: '/user/:id?/edit', name: 'userEdit', component: UserEdit },
    { path: '/user/:id', name: 'userDetails', component: UserDetails },
    { path: '/about', name: 'about', component: About },
  ],
});