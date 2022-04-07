import Swal from 'sweetalert2'
import Vue from 'vue'

export default {
	//ruta_api: 'http://localhost:8000',
	//ruta_subir_archivos: 'http://localhost:8000/importar-excel',
	ruta_api: 'http://localhost:30001',
	ruta_subir_archivos: 'http://localhost:30001/importar-excel',
	//ruta_api: 'http://demo1.zcsystemsperu.com',
	//ruta_subir_archivos: 'http://demo1.zcsystemsperu.com/importar-excel',
	ESTADO_PENDIENTE: 'PENDIENTE',
	ESTADO_EN_REGISTRO: 'EN REGISTRO',
	ESTADO_REGISTRADO: 'REGISTRADO',
	ESTADO_FALLIDO: 'FALLIDO',
	_swal_pregunta: function (text, funcion) {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
			buttonsStyling: false
		})
		swalWithBootstrapButtons.fire({
			title: 'Eliminar',
			text: text,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si',
			cancelButtonText: 'No',
			reverseButtons: true
		}).then((result) => {
			if (result.isConfirmed) {
				funcion();
			}
			/*else if (result.dismiss === Swal.DismissReason.cancel) {}*/
		})
	},
	_mensaje_advertencia: function (msj) {
		return Swal.fire('Advertencia', msj, 'warning');
	},
	_mensaje_error: function (msj) {
		return Swal.fire('Error', msj, 'error');
	},
	_mensaje_exito: function (msj) {
		return Swal.fire('Éxito', msj, 'success');
	},
	_axios_get(ruta, funcion = null, funcion2 = null) {
		return this._axios('get', ruta, null, funcion, funcion2)
	},
	_axios_post(ruta, parametros = null, funcion = null, funcion2 = null) {
		return this._axios('post', ruta, parametros, funcion, funcion2)
	},
	_axios_put(ruta, parametros = null, funcion = null, funcion2 = null) {
		return this._axios('put', ruta, parametros, funcion, funcion2)
	},
	_axios_delete(ruta, parametros = null, funcion = null, funcion2 = null) {
		return this._axios('delete', ruta, parametros, funcion, funcion2)
	},
	_axios_patch(ruta, parametros = null, funcion = null, funcion2 = null) {
		return this._axios('patch', ruta, parametros, funcion, funcion2)
	},
	_axios: function (metodo, ruta, parametros, funcion, funcion2) {
		return Vue.axios({
			method: metodo,
			url: this.ruta_api + ruta,
			data: parametros,
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		})
			.then((response) => {
				let respuesta = response.data;
				if (respuesta.exito) {
					if (funcion != null)
						funcion(respuesta.datos, respuesta);
				}
				else
					this._mensaje_error(respuesta.mensaje || 'Sucedió un error, intentelo nuevamente')
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				if (funcion2 != null)
					funcion2();
			});
	},
	copiarAlPortapapeles(textToCopy) {
		// https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
		// navigator clipboard api needs a secure context (https)
		if (navigator.clipboard && window.isSecureContext) {
			// navigator clipboard api method'
			return navigator.clipboard.writeText(textToCopy);
		} else {
			// text area method
			let textArea = document.createElement("textarea");
			textArea.value = textToCopy;
			// make the textarea out of viewport
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			return new Promise((res, rej) => {
				// here the magic happens
				document.execCommand('copy') ? res() : rej();
				textArea.remove();
			});
		}
	},
}
