import './assets/stylesheets/tailwind.css'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import SVG from "@/plugins/svg.js";

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faAngleLeft, 
  faBars,
  faCalendarAlt,
  faCog,
  faHeart,
  faFlag,
  faLocationArrow, 
  faSearch, 
  faSignOutAlt, 
  faTimes,
  faTimesCircle,
  faQuestionCircle,
  faTrash,
  faImage,
  faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAngleLeft)
library.add(faBars)
library.add(faCog)
library.add(faHeart)
library.add(faLocationArrow)
library.add(faSearch)
library.add(faSignOutAlt)
library.add(faTimes)
library.add(faTimesCircle)
library.add(faQuestionCircle)
library.add(faTrash)
library.add(faFlag)
library.add(faCalendarAlt)
library.add(faImage)
library.add(faUser)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(SVG);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})