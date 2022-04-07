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
import FileAgent from "../components/Extras/FileAgent";
import global from "../global";
export default {
	components: {
		FileAgent,
	},
	data() {
		return {
			bloquear_boton: false,
			datos: null,
			token: "",
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
			location.href = "/procesar-excel/" + this.token;
		},
	},
	created() {},
};
</script>