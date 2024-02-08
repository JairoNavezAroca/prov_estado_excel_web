<template>
	<div class="container">
		<div class="border rounded-3 mt-3 mb-3 p-3">
			<br />
			<div class="text-center">
				<h2 class="text-center">
					Carga de RUC de Proveedores del Estado
				</h2>
				<br />
				<h4>Por favor, ingrese su archivo excel</h4>
				<FileAgent @archivosubido="archivoSubido" />
				<br>
				<toggle-button
					:value="flagBusquedaCompleta"
					:sync="true"
					@change="setFlagBusquedaCompleta"
					:labels="{checked: 'Búsqueda completa', unchecked: 'Búsqueda básica'}"
					:width="350"
					:height="30"
					:font-size="20"/>
				<br>
				<br>
				<button
					v-if="datos != null"
					type="button"
					class="btn btn-success btn"
					:disable="bloquear_boton"
					@click="goProcesar"
				>
					Click aquí para procesar
				</button>
			</div>
			<br />
		</div>
	</div>
</template>

<script>
import FileAgent from "@/components/Extras/FileAgent";
import global from "@/global";
import _login from '../../store/_login'
export default {
	components: {
		FileAgent,
	},
	data() {
		return {
			bloquear_boton: false,
			datos: null,
			token: "",
			flagBusquedaCompleta: false,
			usuario: {},
		};
	},
	computed: {},
	methods: {
		archivoSubido(data) {
			this.bloquear_boton = data.valor;
			this.datos = null;
			if (data.fileRecords.length == 1) {
				this.datos = data.fileRecords[0].upload.data;
				if (this.datos != null) {
					if (!this.datos.exito) {
						global._mensaje_error(this.datos.mensaje);
						this.datos = null;
					} else {
						this.token = this.datos.datos;
					}
				}
			}
		},
		goProcesar: function () {
			localStorage.setItem('flagBusquedaCompleta', this.flagBusquedaCompleta);
			location.href = "/procesar-excel/" + this.token;
		},
		setFlagBusquedaCompleta: function(x){
			console.log(x.value);
			console.log(this.usuario.flagPuedeHacerBusquedaCompleta);
			if (x.value && this.usuario.flagPuedeHacerBusquedaCompleta != true) {
				global._mensaje_advertencia("Usted no puede hacer búsquedas completas, por favor contacte con el administrador del sistema");
				//this.setFlagBusquedaCompleta();
				this.flagBusquedaCompleta = false;
				return;
			}
			else {
				this.flagBusquedaCompleta = x.value;
			}
		}
	},
	created() {
		this.usuario = _login.getters.getUsuario();
		if (this.usuario.flagPuedeHacerBusquedaCompleta == true){
			this.flagBusquedaCompleta = true;
		}
	},
};
</script>