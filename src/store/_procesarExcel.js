import Vue from 'vue'
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
		obtenerCargado: async function (context, token) {
			var respuesta = null;
			await global._axios_get('/obtener-cargado/' + token, (res) => {
				respuesta = res;
			});
			return respuesta;
		},
		procesarRuc: async function (context, data) {
			var respuesta = null;
			var datos_enviar = {
				token: data.token,
				flagFallidos: data.flagFallidos,
			};
			await global._axios_post('/procesar-ruc', datos_enviar, (data, res) => {
				respuesta = res;
				if (respuesta.success == false){
					data.funcion_error(respuesta.mensaje);
				}
			});
			return respuesta;
		},
		exportarAExcel: async function (context, tokenCargaProveedores) {
			location.href = global.ruta_api + '/exportar-excel/' + tokenCargaProveedores;
		},
		actualizarCargadoProveedores: async function (context, data) {
			var respuesta = null;
			var datos_enviar = {
				token: data.token,
				flagBusquedaCompleta: data.flagBusquedaCompleta,
			};
			await global._axios_patch('/cargado-proveedores', datos_enviar, (res) => {
				respuesta = res;
				if (respuesta.success == false){
					data.funcion_error(respuesta.mensaje);
				}
			});
			return respuesta;
		},
	}
}