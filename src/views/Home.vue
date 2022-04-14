<template>
	<div class="view-home">
		<p>Hello, <b>{{userName}}</b>!</p>
		<p><a href="/browser/">Open browser</a></p>
	</div>
</template>

<script>

export default {
	name: 'home',
	components: {
	},
	data() {
		return {
		}
	},
	computed: {
		userName() {
			if (this.$root.userInfo) {
				return this.$root.userInfo.username; 
			} else {
				return 'anonymous user';
			}
		}
	},
	methods: {
	}
}
</script>

<style>
.view-home {
	padding: 2em;
}
</style>
