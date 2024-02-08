<template>
	<div class="container">
		<div class="border rounded-3 mt-3 mb-3 p-3">
			<br />
			<div class="text-center">
				<h2 class="text-center">
					Carga de RUC de Proveedores del Estado
				</h2>
				<br />
				<h4>Por favor, espere a que la carga de datos termine</h4>
				<span>
					Si desea puede volver mas adelante usando el link
					<a :href="linkActual">{{ linkActual }}</a>
				</span>
				<p>Opciones:</p>
				<div class="d-flex justify-content-evenly">
					<router-link to="/" class="btn btn-secondary m-2">
						Iniciar nueva importación
					</router-link>
					<button
						class="btn btn-primary m-2"
						@click="copiarLinkPortapapeles"
					>
						Copiar enlace
					</button>
					<button
						v-if="estadoCompleto"
						class="btn btn-success m-2"
						@click="goExportarAExcel"
					>
						Exportar a Excel
					</button>
					<br />
				</div>
				<div v-if="mensajeWarning != null && mensajeWarning != ''" class="alert alert-warning" role="alert">
					{{ mensajeWarning }}
				</div>
				<div class="d-flex justify-content-evenly">
					<button
						v-if="estadoProcesando == false && cantidadFallidos != 0"
						class="btn btn-outline-success m-2"
						@click="enviarPeticiones(true)"
					>
						Procesar nuevamente fallidos ({{cantidadFallidos}})
					</button>
				</div>
			</div>

			<div class="table-responsive">
				<table class="table table-striped table-hover">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Ruc</th>
							<th scope="col">Razon social</th>
							<th scope="col">Email</th>
							<th scope="col">Telefono</th>
							<th scope="col">Estado</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(item, index) in listaCargaProveedores"
							:key="index"
						>
							<td>{{ index + 1 }}</td>
							<td>{{ item.ruc }}</td>
							<td>{{ item.razon }}</td>
							<td>
								{{ item.emails }}
								<span
									v-if="
										item.emails == null &&
										item.estadoRegistroDatos ==
											ESTADO_REGISTRADO
									"
									>No tiene</span
								>
							</td>
							<td>
								{{ item.telefonos }}
								<span
									v-if="
										item.telefonos == null &&
										item.estadoRegistroDatos ==
											ESTADO_REGISTRADO
									"
									>No tiene</span
								>
							</td>
							<td>
								{{ item.estadoRegistroDatos }}
								<div
									class="spinner-border spinner-border-sm"
									role="status"
									v-if="
										item.estadoRegistroDatos ==
										ESTADO_EN_REGISTRO
									"
								></div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<br />
		</div>
	</div>
</template>

<script>
import FileAgent from "@/components/Extras/FileAgent";
import global from "@/global";
import { mapActions } from "vuex";
export default {
	components: {
		FileAgent,
	},
	data() {
		return {
			tokenCargaProveedores: "",
			listaCargaProveedores: [],
			ESTADO_EN_REGISTRO: "",
			ESTADO_REGISTRADO: "",
			linkActual: "",
			estadoCompleto: false,
			estadoProcesando: false,
			listaIdIntentando: [],
			cantidadFallidos: 0,
			mensajeWarning: '',
		};
	},
	methods: {
		...mapActions("_procesarExcel", [
			"obtenerCargado",
			"procesarRuc",
			"exportarAExcel",
			"actualizarCargadoProveedores",
		]),
		cargarDatos: async function () {
			var listado = await this.obtenerCargado(this.tokenCargaProveedores);
			this.listaCargaProveedores = listado.lista_ruc;
		},
		calcularFallidos: function(){
			return this.listaCargaProveedores.filter(
				(x) => x.estadoRegistroDatos == global.ESTADO_FALLIDO
			).length;
		},
		gestionarEnviarPeticiones: async function () {
			await this.enviarPeticiones(false, 4);
			this.cantidadFallidos = this.calcularFallidos();
			if (this.cantidadFallidos > 0) {
				await this.enviarPeticiones(true, 1);
				this.cantidadFallidos = this.calcularFallidos();
			}
			if (this.listaIdIntentando.length != 0) {
				//significa que se ha intentado
				//this.$router.go();
			}
		},
		enviarPeticiones: async function (
			flagFallidos,
			peticionesParalelo = 4
		) {
			this.estadoProcesando = true;
			var cantidadPeticionesParalelo = peticionesParalelo;
			this.listaIdIntentando = [];
			do {
				if (flagFallidos) {
					this.cambiarEstadoFlagFallidos();
				}
				var listaProcesar = this.listaCargaProveedores
					.filter(
						(x) => x.estadoRegistroDatos == global.ESTADO_PENDIENTE
					)
					.slice(0, cantidadPeticionesParalelo);
				listaProcesar.map(
					(x) => (x.estadoRegistroDatos = global.ESTADO_EN_REGISTRO)
				);
				if (listaProcesar.length != 0) {
					var listaPromesas = [];
					var that = this;
					listaProcesar.forEach((item) => {
						this.listaIdIntentando.push(item.idProveedor);
						var peticion = this.procesarRuc({
							token: item.token,
							flagFallidos: flagFallidos,
							funcion_error: (msj) =>
								this.$toastr.error(msj, "Error", {
									closeDuration: 50,
								}),
						});
						peticion.then((x) => {
							if (x.warning == true){
								that.mensajeWarning = x.mensaje;
							}
						});
						listaPromesas.push(peticion);
					});
					await Promise.all(listaPromesas); // antes era: listaProcesar
					await this.cargarDatos();
				}
			} while (listaProcesar.length != 0);
			await this.cargarDatos();
			this.verificarEstado();
			this.estadoProcesando = false;
		},
		resetearEstadoFlagFallidos: function () {
			this.listaIdIntentando = [];
		},
		cambiarEstadoFlagFallidos: function () {
			this.listaCargaProveedores = this.listaCargaProveedores.map((x) => {
				if (
					x.estadoRegistroDatos == global.ESTADO_FALLIDO &&
					this.listaIdIntentando.indexOf(x.idProveedor) == -1
				) {
					x.estadoRegistroDatos = global.ESTADO_PENDIENTE;
				}
				return x;
			});
		},
		verificarEstado: function () {
			this.estadoCompleto =
				this.listaCargaProveedores.filter(
					(x) => x.estadoRegistroDatos == global.ESTADO_EN_REGISTRO
				).length == 0;
		},
		copiarLinkPortapapeles: function () {
			global
				.copiarAlPortapapeles(this.linkActual)
				.then(() =>
					global._mensaje_exito("Link copiado al portapapeles")
				)
				.catch(() => {
					console.log("error");
					global._mensaje_exito(
						"Sucedió un error, intente nuevamente"
					);
				});
		},
		goExportarAExcel: function () {
			this.exportarAExcel(this.tokenCargaProveedores);
		},
	},
	async created() {
		this.linkActual = location.href;
		this.ESTADO_EN_REGISTRO = global.ESTADO_EN_REGISTRO;
		this.ESTADO_REGISTRADO = global.ESTADO_REGISTRADO;
		if (this.$route.params.token) {
			this.tokenCargaProveedores = this.$route.params.token;
			if (localStorage.key('flagBusquedaCompleta')) {
				const flagBusquedaCompleta = localStorage.getItem('flagBusquedaCompleta');
				await this.actualizarCargadoProveedores({ token: this.tokenCargaProveedores, flagBusquedaCompleta });
				localStorage.removeItem('flagBusquedaCompleta');
			}
			await this.cargarDatos();
			//this.enviarPeticiones(false);
			this.gestionarEnviarPeticiones(false);
		} else {
			location.href = "/";
		}
	},
};
/*
var that = this;
var a = setInterval(async function(){
	await that.cargarDatos();
	that.verificarEstado();
	that.estadoProcesando = false;
	clearInterval(a);
}, 2000);
*/
</script>
