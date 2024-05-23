<template>
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Ruc</th>
                    <th scope="col">Razon social</th>
                    <th scope="col">Está Habilitado</th>
                    <th scope="col">
                        Seleccionar
                        <input class="form-check-input" type="checkbox" v-model="flagSeleccionadoGlobal" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in listaPersonas" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.ruc }}</td>
                    <td class="text-start">{{ item.razon }}</td>
                    <td>
                        <span v-if="item.esHabilitado">Si</span>
                        <span v-else>No</span>
                    </td>
                    <td>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="item.flagSeleccionado"
                            @change="clickCheckBoxSeleccionar($event, item)"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        listaPersonas: Array,
    },
    data() {
        return {
            flagSeleccionadoGlobal_: false,
        };
    },
    computed: {
        flagSeleccionadoGlobal: {
            get() {
                this.flagSeleccionadoGlobal_ = false;
                const cantidadNoSeleccionados = this.listaPersonas.filter((x) => !x.flagSeleccionado).length;
                if (this.listaPersonas.length == 0) this.flagSeleccionadoGlobal_ = false;
                else if (cantidadNoSeleccionados == 0) this.flagSeleccionadoGlobal_ = true;
                this.$forceUpdate();
                return this.flagSeleccionadoGlobal_;
            },
            set(valor) {
                this.flagSeleccionadoGlobal_ = valor;
                this.listaPersonas.forEach((item) => {
                    item.flagSeleccionado = valor;
                    this.$emit("clickCheckBoxSeleccionar", item);
                });
            },
        },
    },
    methods: {
        clickCheckBoxSeleccionar: function (event, item) {
            this.$forceUpdate();
            this.$nextTick(() => {
                this.$emit("clickCheckBoxSeleccionar", item);
            });
        },
    },
    async created() {},
};
</script>
