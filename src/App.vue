<template>
    <div id="app" class="">
		<div class="menu-row">
			<Menubar id="mainmenu" :model="menuItems" style="font-size:120%">
				<template #start><router-link to="/"><span class="logo">FitLayout</span></router-link></template>
				<template #end>
					<UserAvatar :userInfo="userInfo" />
            	</template>
			</Menubar>
		</div>
		<div class="main-content">
	    	<router-view></router-view>
		</div>
    </div>
</template>

<script>
import { computed } from 'vue';
import Menubar from 'primevue/menubar';
import UserAvatar from '@/components/UserAvatar.vue';

import {ApiClient} from '@/common/apiclient.js';

export default {
    name: 'app',
	data() {
		return {
			apiClient: null,
			userInfo: null,
			
			menuItems: []
		}
	},
	provide() {
		return {
			userInfo: computed(() => this.userInfo)
		};
    },
	components: {
		Menubar,
		UserAvatar
	},
	async created() {
		this.apiClient = new ApiClient();
		this.apiClient.onNotAuthorized = this.authFailed;
		await this.loadUserInfo();
	},
	methods: {
		authFailed() {
			this.$router.push({name: 'login'});
		},
		async loadUserInfo() {
			this.userInfo = await this.apiClient.getUserInfo();
		},
		isAdmin() {
			return this.userInfo && this.userInfo.roles && this.userInfo.roles.includes('admin');
		}
	}
}
</script>

<style>
html {
	font-size: 10pt;
}
body {
	margin: 0;
	padding: 0;
}
.h-100 {
	height: 100%;
}
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.font-monospace {
	font-family: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}

.p-inputtext.ok.p-component {
    border-color: var(--green-500);
}

#app {
	font-family: var(--font-family);
	color: var(--text-color);
	background-color: var(--surface-a);
}

.logo {
	padding: 0.5em 1em;
	color: var(--text-color);
	background: var(--surface-d);
	display: inline-block;
	border-radius: 5px;
	font-weight: bold;
}

</style>
