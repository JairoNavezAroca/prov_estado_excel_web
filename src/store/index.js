import Vue from 'vue'
import Vuex from 'vuex'
import _procesarExcel from './_procesarExcel'
import _login from './_login'
import _busquedaManual from './_busquedaManual'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		_procesarExcel,
		_login,
		_busquedaManual,
	}
})
