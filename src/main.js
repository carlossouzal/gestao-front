import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueRouterPrefetch from 'vue-router-prefetch'
import VueNotify from 'vue-notifyjs'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import App from './App.vue'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'
import initProgress from './progressbar';

import { isAuthenticate } from './services/auth'

// router setup
import routes from './routes/routes'

// library imports

import './assets/sass/paper-dashboard.scss'
import './assets/sass/demo.scss'

import sidebarLinks from './sidebarLinks'
import './registerServiceWorker'

import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowRightFromBracket) 
Vue.component('font-awesome-icon', FontAwesomeIcon)

// plugin setup
Vue.use(VueRouter)
Vue.use(VueRouterPrefetch)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar, {sidebarLinks: sidebarLinks})
locale.use(lang)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active',
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  }
});

router.beforeEach( async (to, from, next) => {
  if(to.name != 'Login' && !(await isAuthenticate())){
    next({name: 'Login'});
  }else{
    next();
  }
});

initProgress(router);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
