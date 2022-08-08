import Vue from 'vue'
import VueRouter from 'vue-router'
import _login from '../store/_login'

Vue.use(VueRouter)

const AutenticacionContainer = () => import('@/containers/AutenticacionContainer.vue')
const PanelContainer = () => import('@/containers/PanelContainer.vue')

const routes = [
	{
		path: '/',
		name: '/',
		redirect: '/cargar-excel',
	},
	{
		path: '/login',
		component: AutenticacionContainer,
		children: [
			{
				path: '/login',
				meta: { necesita_autenticacion: false },
				component: () => import('@/views/Autenticacion/Login.vue')
			},
		]
	},
	{
		path: '/',
		component: PanelContainer,
		children: [
			{
				path: '/cargar-excel',
				name: 'home',
				meta: { necesita_autenticacion: true, necesita_haber_cambiado_contrasena: true },
				component: () => import('../views/Panel/SubidaExcel.vue')
			},
			{
				path: '/procesar-excel/:token',
				meta: { necesita_autenticacion: true, necesita_haber_cambiado_contrasena: true },
				component: () => import('../views/Panel/ProcesamientoExcel.vue')
			},
			{
				path: '/cambiar-contrasena',
				meta: { necesita_autenticacion: true },
				component: () => import('../views/Autenticacion/CambiarContrasena.vue')
			},
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	const necesita_autenticacion = to.meta.necesita_autenticacion;
	const necesita_haber_cambiado_contrasena = to.meta.necesita_haber_cambiado_contrasena || false;
	const esta_logueado = _login.getters.esta_logueado(_login.state);
	const usuario = _login.getters.getUsuario();
	if (necesita_autenticacion == true) {
		if (esta_logueado) {
			if (necesita_haber_cambiado_contrasena && usuario.flagObligarCambiarContrasena)
				next('/cambiar-contrasena')
			else
				next()
		}
		else {
			next('/login')
		}
	}
	else if (necesita_autenticacion == false) {//rutas de login
		if (esta_logueado) {
			next('/')
		}
		else {
			next()
		}
	}
	else { // para cuando es null
		next();
	}
})

export default router
