import Vue from 'vue'
Vue.use(require('vue-cookies'))
import global from '../global'

export default {
    namespaced: true,
    state: {
        jwt: $cookies.get('jwt') || null,
        usuario: $cookies.get('usuario') || null,
    },
    getters: {
        usuario_nombre(state) {
            return `${state.usuario?.nombres} ${state.usuario?.apellidoPaterno} ${state.usuario?.apellidoMaterno}`;
        },
        esta_logueado(state) {
            return ($cookies.get('jwt') || null) != null;
        },
        getUsuario() {
            return $cookies.get('usuario');
        },
    },
    mutations: {
        guardar_jwt: function (state, jwt) {
            state.jwt = jwt;
        },
        borrar_jwt: function (state) {
            state.jwt = null;
        },
        login: function (state, data) {
            state.jwt = data.jwt;
            state.usuario = data.usuario;
        },
        logout: function (state) {
            state.jwt = null;
            state.usuario = null;
            state.acciones = null;
        },
    },
    actions: {
        login: async function (context, datos) {
            var respuesta = false;
            await global._axios_post('/login', datos, (res) => {
                $cookies.set('jwt', res.jwt)
                $cookies.set('usuario', res.usuario)
                context.commit('login', res);
                respuesta = true;
            });
            return respuesta;
        },
        logout: async function (context) {
            $cookies.remove('jwt');
            $cookies.remove('usuario');
            $cookies.remove('acciones');
            context.commit('logout');
        },
        cambiarContrasena: async function (context, datos) {
            var respuesta = null;
            await global._axios_patch('/cambiar-contrasena', datos, (res) => {
                respuesta = res;
                $cookies.set('jwt', res.jwt)
                $cookies.set('usuario', res.usuario)
                context.commit('login', res);
            });
            return respuesta;
        },
    }
}