<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    Bienvenido {{ usuario_nombre }}
                </a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div
                    class="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link
                                class="nav-link active"
                                aria-current="page"
                                to="/cargar-excel"
                            >
                                Ir a Cargar excel
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link
                                class="nav-link active"
                                aria-current="page"
                                to="/cambiar-contrasena"
                            >
                                Cambiar contraseña
                            </router-link>
                        </li>
                    </ul>
                    <div class="d-flex">
                        <button
                            class="btn btn-outline-success"
                            type="submit"
                            @click="goCerrarSesion"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    name: "PanelContainer",
    components: {},
    computed: {
        ...mapGetters("_login", ["usuario_nombre"]),
    },
    methods: {
        ...mapActions("_login", ["logout"]),
        goCerrarSesion: function () {
			this.logout();
				this.$root.$router.go("/");
		},
    },
    mounted() {},
};
</script>