<template>
	<div>
		<main>
			<header class="p-2 bg-danger">
				<div class="container-fluid">
					<div class="row">
						<h3 class="mb-3 text-center text-white pt-2">
							<span id="app_container_texto_titulo">...</span>
						</h3>
					</div>
				</div>
			</header>

			<section class="button-components">
				<div class="container-fluid">
					<br />
					<div class="buttons-cards-wrapper">
						<div class="row">
							<div class="col-lg-12">
								<div class="card-style mb-30">
									<router-view></router-view>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script>
export default {
	name: "PanelContainer",
	components: {},
};
</script>

<style>
.bg-danger{
	background-color: #CA1E42 !important;
}
.btn-danger{
	background-color: #CA1E42 !important;
}
</style>
