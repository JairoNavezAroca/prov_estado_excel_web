<template>
	<div>
		<VueFileAgent
			ref="vueFileAgent"
			:theme="'grid'"
			:multiple="true"
			:deletable="true"
			:meta="true"
			:accept="tipos_"
			:maxSize="'10MB'"
			:maxFiles="maxFiles_"
			:helpText="textoAyuda_"
			:uploadUrl="uploadUrl"
			@select="filesSelected($event)"
			@delete="fileDeleted($event)"
			:errorText="{
				type: 'Tipo de archivo incorrecto',
				size: 'El archivo puede tener un máximo de 10MB',
			}"
			v-model="fileRecords"
		></VueFileAgent>
		<div class="text-center">
			<Loader :mostrar="mostrarLoader" :texto="texto"></Loader>
		</div>
		<br />
	</div>
</template>

<script>
import global from "../../global";
import Loader from "./Loader";
export default {
	props: {
		tipos: String,
		maxFiles: String,
		textoAyuda: String,
	},
	components: {
		Loader,
	},
	data() {
		return {
			textoAyuda_: "",
			tipos_: "",
			maxFiles_: 1,
			fileRecords: [],
			fileRecordsForUpload: [],
			uploadUrl: "",
			uploadHeaders: {
				"X-Test-Header": "vue-file-agent",
			},
			varRepeticiones: null,
			mostrarLoader: false,
			texto: "",
		};
	},
	methods: {
		reset: function () {
			this.fileRecords = [];
		},
		invocar: function (valor) {
			//console.log(this.fileRecords);
			this.mostrarLoader = valor;
			this.$emit("archivosubido", {
				valor: valor,
				fileRecords: this.fileRecords,
			});
		},
		funccionn: function (that) {
			//console.log(that.fileRecords);
			//true=ya subió, false=todavía
			var bul = true;
			that.fileRecords.forEach((item) => {
				bul = bul && item.upload.data != null;
			});
			if (bul) {
				this.invocar(false);
				clearInterval(this.varRepeticiones);
			}
		},
		funcionnn: function () {
			this.invocar(true);
			var that = this;
			this.varRepeticiones = setInterval(this.funccionn, 500, that);
		},
		filesSelected: function (fileRecordsNewlySelected) {
			this.funcionnn();
			var validFileRecords = fileRecordsNewlySelected.filter(
				(fileRecord) => !fileRecord.error
			);
			this.fileRecordsForUpload =
				this.fileRecordsForUpload.concat(validFileRecords);
		},
		fileDeleted: function (fileRecord) {
			this.funcionnn();
			var i = this.fileRecordsForUpload.indexOf(fileRecord);
			if (i !== -1) {
				this.fileRecordsForUpload.splice(i, 1);
			} else {
				this.deleteUploadedFile(fileRecord);
			}
		},
		uploadFiles: function () {
			this.$refs.vueFileAgent.upload(
				this.uploadUrl,
				this.uploadHeaders,
				this.fileRecordsForUpload
			);
			this.fileRecordsForUpload = [];
		},
		deleteUploadedFile: function (fileRecord) {
			this.$refs.vueFileAgent.deleteUpload(
				this.uploadUrl,
				this.uploadHeaders,
				fileRecord
			);
		},
	},
	mounted() {
		this.uploadUrl = global.ruta_subir_archivos;
		this.tipos_ = ".xls,.xlsx";
		this.maxFiles_ = 1;
		this.texto = "Su archivo se está cargando, espere por favor";
		this.textoAyuda_ = "Click para seleccionar su archivo";
	},
	created: function () {},
};
</script>
