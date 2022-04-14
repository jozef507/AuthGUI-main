<template>
	<span class="user-avatar">
       	<Button icon="pi pi-user" class="p-button-rounded p-button-info" @click="toggle" />
		<Menu ref="menu" :model="items" :popup="true" />
	</span>
</template>

<script>
import Button from 'primevue/button';
import Menu from 'primevue/menu';

export default {
	name: 'UserAvatar',
	components: {
		Button,
		Menu
	},
	props: {
		userInfo: null
	},
	data () {
		return {
			items: []
		}
	},
	created () {
		this.createMenu();
	},
	watch: {
		userInfo: 'createMenu'
	},
	methods: {
		createMenu() {
			this.items = [];
			if (this.userInfo) {
				this.items.push({
					label: this.userInfo.username,
					class: 'user-id',
					to: '/profile'
				});
			} else {
				this.items.push({
					label: 'Anonymous user',
					class: 'user-id'
				});
			}
			this.items.push({
				label: 'FitLayout Browser',
				icon: 'pi pi-globe',
				url: '/browser/'
			});
			if (this.$root.isAdmin()) {
				this.items.push({
					separator: true
				});
				this.items.push({
					label: 'User administration',
					icon: 'pi pi-user-edit',
					to: '/admin/users'
				});
				this.items.push({
					label: 'Log',
					icon: 'pi pi-file',
					to: '/admin/log'
				});
			}
			this.items.push({
				separator: true
			});
			if (this.userInfo) {
				this.items.push({
					label: 'Sign out',
					icon: 'pi pi-fw pi-sign-out',
					to: '/login',
					command: () => {
						this.$root.apiClient.logout();
					}
				});
			} else {
				this.items.push({
					label: 'Sign in',
					icon: 'pi pi-fw pi-sign-in',
					to: '/login',
					command: () => {
						this.$root.apiClient.logout();
					}
				});
			}
		},
		toggle(event) {
    		this.$refs.menu.toggle(event);
		}
	}
}
</script>

<style>
	.p-menu .user-id {
		font-weight: bold;
	}
</style>
