<template>
    <form
        class="card-body cardbody-color p-lg-5"
        @submit.prevent="goValidarUsuario"
    >
        <!--
                        <div class="text-center">
                            <img
                                src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png"
                                class="
                                    img-fluid
                                    profile-image-pic
                                    img-thumbnail
                                    rounded-circle
                                    my-3
                                "
                                width="200px"
                                alt="profile"
                            />
                        </div>
                        -->

        <div class="mb-3 mt-3">
            <input
                type="text"
                class="form-control"
                aria-describedby="emailHelp"
                placeholder="Usuario"
                v-model="usuario"
                required
            />
        </div>
        <div class="mb-3">
            <input
                type="password"
                class="form-control"
                placeholder="Contraseña"
                v-model="contrasena"
                required
            />
        </div>
        <div class="text-center">
            <button type="submit" class="btn btn-color px-5 mb-5 w-100">
                Login
            </button>
        </div>
        <!--
                        <div
                            id="emailHelp"
                            class="form-text text-center mb-5 text-dark"
                        >
                            Not Registered?
                            <a href="#" class="text-dark fw-bold">
                                Create an Account</a
                            >
                        </div>
                        -->
    </form>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            usuario: "",
            contrasena: "",
        };
    },
    methods: {
        ...mapActions("_login", ["login"]),
        goValidarUsuario: async function () {
            if (
                await this.login({
                    usuario: this.usuario,
                    contrasena: this.contrasena,
                })
            ) {
                this.$root.$router.push("/");
            }
        },
    },
    async created() {},
};
</script>

<style scoped>
.btn-color {
    background-color: #0e1c36;
    color: #fff;
}

.profile-image-pic {
    height: 200px;
    width: 200px;
    object-fit: cover;
}

.cardbody-color {
    background-color: #ebf2fa;
}

a {
    text-decoration: none;
}
</style>
