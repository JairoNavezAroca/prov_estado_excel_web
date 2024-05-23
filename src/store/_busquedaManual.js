import global from '../global'

export default {
	namespaced: true,
	state: {
	},
	getters: {
	},
	mutations: {
	},
	actions: {
		consultarPersona: async function (context, data) {
			var respuesta = null;
			var ruta = '/consultar-persona?' + global._json_to_query_string(data);
			await global._axios_get(ruta, (res, res2) => {
				respuesta = res2;
			});
			return respuesta;
		},
		importarRucsManualmente: async function (context, data) {
			var respuesta = null;
			await global._axios_post('/importar-rucs-manualmente', data, (res) => {
				respuesta = res;
			});
			return respuesta;
		},
	}
}