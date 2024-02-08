import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// Vue Axios
//https://www.npmjs.com/package/vue-axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Vue Loaders
//https://github.com/Hokid/vue-loaders
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';
Vue.use(VueLoaders);

// Vue File Agent
//https://www.npmjs.com/package/vue-file-agent
import VueFileAgent from 'vue-file-agent'
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css'
Vue.use(VueFileAgent);

// https://bestofvue.com/repo/saivarunk-vue-toastr-2-vuejs-notification
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
window.toastr = require('toastr')
Vue.use(VueToastr2)

// Vue Cookies
// https://www.npmjs.com/package/vue-cookies
Vue.use(require('vue-cookies'))
$cookies.config('1d')

// http://vue-js-toggle-button.yev.io/
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
