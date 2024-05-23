<template>
    <div class="container">
        <div class="border rounded-3 mt-3 mb-3 p-3">
            <br />
            <div class="text-center">
                <h2 class="text-center">Búsqueda de Proveedores del Estado</h2>
                <h5>Búsqueda por razón social</h5>
                <br />
                <div class="d-flex justify-content-evenly">
                    <div class="input-group">
                        <input
                            v-model="razonSocial"
                            type="text"
                            class="form-control"
                            placeholder="Razón social"
                            aria-label="Recipient's username with two button addons"
                        />
                        <button @click="iniciarBusqueda" class="btn btn-success" type="button">Buscar</button>
                        <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalSeleccionados">
                            Ver seleccionados
                        </button>
                    </div>
                </div>

                <div class="text-end">Rucs seleccionados {{ listaPersonasSeleccionadas.length }} / {{ cantidadMaximaRucs }}</div>
                <br />

                <nav aria-label="Page navigation example" v-if="resultadoBusqueda.totalPaginas > 1">
                    <ul class="pagination justify-content-center">
                        <li class="page-item">
                            <button class="page-link" @click="buscarPorRazonSocial(1)" :disabled="cargando">
                                <span aria-hidden="true">Inicio</span>
                            </button>
                        </li>
                        <li v-for="item in resultadoBusqueda.totalPaginas" :key="item" :class="obtenerClasePaginacion(item)">
                            <button
                                v-if="validarBotonPaginacionOculto(item)"
                                class="page-link"
                                href="#"
                                @click="buscarPorRazonSocial(item)"
                                :disabled="cargando"
                            >
                                {{ item }}
                            </button>
                        </li>
                        <!-- <li class="page-item"><button class="page-link" href="#">2</button></li> -->
                        <!-- <li class="page-item"><button class="page-link" href="#">3</button></li> -->
                        <li class="page-item">
                            <button class="page-link" @click="buscarPorRazonSocial(resultadoBusqueda.totalPaginas)" :disabled="cargando">
                                <span aria-hidden="true">Fin</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                <TablaBusquedaManual
                    v-if="!cargando && resultadoBusqueda.totalPaginas > 1"
                    :listaPersonas="resultadoBusqueda.lista"
                    @clickCheckBoxSeleccionar="clickCheckBoxSeleccionar"
                >
                </TablaBusquedaManual>

                <div class="text-center" v-if="cargando">
                    <div class="spinner-grow spinner-grow-lg" role="status"></div>
                    <br />
                    Cargando...
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div
            class="modal fade"
            id="modalSeleccionados"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">RUCs Seleccionados</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <TablaBusquedaManual
                            :listaPersonas="listaPersonasSeleccionadas"
                            @clickCheckBoxSeleccionar="clickCheckBoxSeleccionar"
                        >
                        </TablaBusquedaManual>
                    </div>
                    <div class="modal-footer" style="justify-content: space-between">
                        <toggle-button
                            :value="flagBusquedaCompleta"
                            :sync="true"
                            @change="setFlagBusquedaCompleta"
                            :labels="{ checked: 'Búsqueda completa', unchecked: 'Búsqueda básica' }"
                            :width="350"
                            :height="30"
                            :font-size="20"
                        />
                        <div>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button
                                type="button"
                                class="btn btn-success ms-2"
                                @click="procesarCargadoRucs()"
                                :disabled="cargandoRucs || listaPersonasSeleccionadas.length == 0"
                            >
                                Consultar data de los RUCs seleccionados
                            </button>
                            <div v-if="cargandoRucs" class="spinner-grow spinner-grow-lg" role="status"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TablaBusquedaManual from "@/components/TablaBusquedaManual.vue";
import global from "@/global";
import { mapActions } from "vuex";
import _login from "../../store/_login";
export default {
    components: { TablaBusquedaManual },
    data() {
        return {
            razonSocial: "",
            paginaActual: 1,
            resultadoBusqueda: {
                paginaActual: 0,
                totalPaginas: 0,
                totalRegistros: 0,
                lista: [],
            },
            listaPersonasSeleccionadas: [],
            cargando: false,
            cargandoRucs: false,
            flagBusquedaCompleta: false,
            usuario: {},
            flagResultadoVacio: false,
            cantidadMaximaRucs: global.CANTIDAD_MAXIMA_SELECCION_BUSQUEDA_MANUAL,
        };
    },
    methods: {
        ...mapActions("_busquedaManual", ["consultarPersona", "importarRucsManualmente"]),
        iniciarBusqueda: async function () {
            this.listaPersonasSeleccionadas = [];
            this.buscarPorRazonSocial(1);
        },
        buscarPorRazonSocial: async function (pagina) {
            this.cargando = true;
            this.flagResultadoVacio = false;
            this.paginaActual = pagina;
            let resultado = await this.consultarPersona({
                razonSocial: this.razonSocial,
                index: this.paginaActual,
            });
            if (resultado.mensaje != null && resultado.mensaje != "") global._mensaje_advertencia(resultado.mensaje);
            this.resultadoBusqueda = resultado.datos;
            this.resultadoBusqueda.lista = this.resultadoBusqueda.lista.filter((x) => x.ruc != null && x.ruc != "");
            if (this.resultadoBusqueda.lista.length == 0) {
                this.flagResultadoVacio = true;
            } else {
                this.asignarFlagSeleccionado();
            }
            this.cargando = false;
        },
        asignarFlagSeleccionado: function () {
            this.resultadoBusqueda.lista.forEach((item, index) => {
                this.resultadoBusqueda.lista[index].flagSeleccionado = false;
                let existe = this.listaPersonasSeleccionadas.find((x) => x.ruc == item.ruc);
                if (existe) this.resultadoBusqueda.lista[index].flagSeleccionado = true;
                this.$set(this.resultadoBusqueda.lista, index, item);
            });
        },
        obtenerClasePaginacion: function (item) {
            const activo = item == this.resultadoBusqueda.paginaActual;
            return {
                "page-item": true,
                active: activo,
            };
        },
        validarBotonPaginacionOculto: function (item) {
            const cantidadElementos = 7;
            let diferencia = item - this.resultadoBusqueda.paginaActual;
            diferencia = Math.abs(diferencia);
            if (this.resultadoBusqueda.paginaActual + diferencia <= cantidadElementos) return true;
            if (this.resultadoBusqueda.totalPaginas - this.resultadoBusqueda.paginaActual + diferencia <= cantidadElementos - 1)
                return true;
            // if (this.resultadoBusqueda.paginaActual == 1) return diferencia < 7;
            // if (this.resultadoBusqueda.paginaActual == 2) return diferencia < 6;
            // if (this.resultadoBusqueda.paginaActual == 3) return diferencia < 5;
            // if (this.resultadoBusqueda.paginaActual == this.resultadoBusqueda.totalPaginas) return diferencia < 7;
            // if (this.resultadoBusqueda.paginaActual == this.resultadoBusqueda.totalPaginas - 1) return diferencia < 6;
            // if (this.resultadoBusqueda.paginaActual == this.resultadoBusqueda.totalPaginas - 2) return diferencia < 5;
            return diferencia < Math.round(cantidadElementos / 2);
        },
        clickCheckBoxSeleccionar: function (item) {
            if (item.flagSeleccionado) {
                if (this.listaPersonasSeleccionadas.findIndex((x) => x.ruc == item.ruc) == -1) {
                    if (this.validarExcedeCantidadMaximaSeleccion()) return;
                    this.listaPersonasSeleccionadas.push({ ...item });
                }
            } else {
                this.listaPersonasSeleccionadas = this.listaPersonasSeleccionadas.filter((x) => x.ruc != item.ruc);
            }
            this.asignarFlagSeleccionado();
        },
        validarExcedeCantidadMaximaSeleccion: function () {
            const cantidadMaximoSeleccionar = global.CANTIDAD_MAXIMA_SELECCION_BUSQUEDA_MANUAL;
            if (this.listaPersonasSeleccionadas.length >= cantidadMaximoSeleccionar) {
                this.asignarFlagSeleccionado();
                global._mensaje_advertencia("Solo se pueden seleccionar hasta " + cantidadMaximoSeleccionar + " RUCs.");
                return true;
            }
            return false;
        },
        procesarCargadoRucs: async function () {
            this.cargandoRucs = true;
            try {
                const token = await this.importarRucsManualmente({ listaRuc: this.listaPersonasSeleccionadas });
                localStorage.setItem("flagBusquedaCompleta", this.flagBusquedaCompleta);
                const url = "/procesar-excel/" + token;
                window.open(url, "_blank").focus();
                this.limpiarBusqueda();
            } catch (error) {
                console.error(error);
            }
            this.cargandoRucs = false;
        },
        limpiarBusqueda: function () {
            var modalSeleccionados = bootstrap.Modal.getInstance(document.getElementById("modalSeleccionados"));
            modalSeleccionados.hide();
            this.listaPersonasSeleccionadas = [];
            this.resultadoBusqueda.lista.forEach((x) => (x.flagSeleccionado = false));
            this.asignarFlagSeleccionado();
        },
        setFlagBusquedaCompleta: function (x) {
            if (x.value && this.usuario.flagPuedeHacerBusquedaCompleta != true) {
                global._mensaje_advertencia(
                    "Usted no puede hacer búsquedas completas, por favor contacte con el administrador del sistema"
                );
                this.flagBusquedaCompleta = false;
                return;
            } else {
                this.flagBusquedaCompleta = x.value;
            }
        },
    },
    created() {
        this.usuario = _login.getters.getUsuario();
        if (this.usuario.flagPuedeHacerBusquedaCompleta == true) {
            this.flagBusquedaCompleta = true;
        }
    },
};
</script>
