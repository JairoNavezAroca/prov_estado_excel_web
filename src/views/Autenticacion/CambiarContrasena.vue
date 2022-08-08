<template>
    <form class="container text-center" @submit.prevent="goCambiarContrasena">
        <h3 class="mt-4 mb-4">Cambiar contraseña</h3>
        <div class="row d-flex justify-content-center mb-3">
            <div class="col-md-6 mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                    Contraseña Actual
                </label>
                <input
                    type="password"
                    class="form-control"
                    v-model="contrasenaActual"
                    required
                />
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                    Contraseña Nueva
                </label>
                <input
                    type="password"
                    class="form-control"
                    v-model="contrasenaNueva"
                    required
                />
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                    Repetir contraseña
                </label>
                <input
                    type="password"
                    class="form-control"
                    v-model="contrasenaNueva2"
                    required
                />
                <div
                    class="alert alert-danger mt-2"
                    role="alert"
                    v-if="contrasenaNueva != contrasenaNueva2"
                >
                    Las contraseñas deben ser iguales
                </div>
            </div>
        </div>
        <button
            type="submit"
            class="btn btn-primary m-3"
            v-if="contrasenaNueva == contrasenaNueva2"
        >
            Cambiar contraseña
        </button>
    </form>
</template>

<script>
import global from "@/global";
import { mapActions } from "vuex";
export default {
    data() {
        return {
            contrasenaActual: "",
            contrasenaNueva: "",
            contrasenaNueva2: "",
        };
    },
    methods: {
        ...mapActions("_login", ["cambiarContrasena"]),
        goCambiarContrasena: async function () {
            if (this.contrasenaActual == this.contrasenaNueva){
                global._mensaje_error("Las contraseña nueva no puede ser igual que la actual");
                return;
            }
            if (
                await this.cambiarContrasena({
                    contrasenaActual: this.contrasenaActual,
                    contrasenaNueva: this.contrasenaNueva,
                })
            ) {
                await global._mensaje_exito("La contraseña se ha cambiado correctamente");
                this.$root.$router.push("/");
            }
        },
    },
    async created() {},
};
</script>
