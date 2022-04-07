<template>
    <div :hidden="!mostrar">
  		<vue-loaders name="ball-clip-rotate-pulse" color="black" scale="0.9"></vue-loaders>
		<!--
	  	<vue-loaders name="ball-spin-fade-loader" color="black" scale="0.9"></vue-loaders>
		-->
		<br>{{texto_}}
		<!--<br>Subiendo imagen...-->
    </div>
</template>

<script>
export default {
	name: 'Loader',
	props: {
		mostrar: Boolean,
		texto: String
	},
	data() {
		return {
			texto_: this.texto
		}
	},
	methods: {
	},
	mounted() {
		if (this.texto == null || this.texto == '')
			this.texto_ = 'Cargando...';
	},
}
</script>
