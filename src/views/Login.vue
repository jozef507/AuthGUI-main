<template>
	<div class="view-login regform">
		<Card>
			<!--<template #header>
				<img alt="user header" src="demo/images/usercard.png">
			</template>-->
			<template #title>
				FitLayout Login
			</template>
			<template #content>
				<form @submit="submitForm">
					<div class="p-fluid form-content">
						<div class="login-message" v-if="loginMessage">
							<p>{{loginMessage}}</p>
						</div>
						<div class="p-field">
							<label for="userId">User ID</label>
							<InputText id="userId" type="text" v-model="userid" />
						</div>
						<div class="p-field">
							<label for="password">Password</label>
							<InputText id="password" type="password" v-model="password" />
						</div>
						<div class="error" v-if="error">
							<InlineMessage severity="error">{{error}}</InlineMessage>
						</div>
						<div class="buttons">
							<Button icon="pi pi-times" label="Cancel" class="p-button-secondary" @click="onCancel" />
							<Button icon="pi pi-check" label="Login" type="submit" />
						</div>
					</div>
				</form>
			</template>
			<template #footer>
				<p><router-link to="/register">Register new user</router-link></p>
				<p><router-link to="/recover">Forgotten password?</router-link></p>
			</template>
		</Card>

	</div>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';

export default {
	name: 'login',
	components: {
		Card,
		Button,
		InputText,
		InlineMessage
	},
	//inject: ['apiClient'],
	data() {
		return {
			apiClient: null,
			userid: '',
			password: '',
			error: '',
			loginMessage: null,
			redirect: null
		}
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.loginMessage = localStorage.getItem('loginMsg');
		localStorage.removeItem('loginMsg');
		this.redirect = localStorage.getItem('redirect');
		localStorage.removeItem('redirect');
	},
	methods: {
		async submitForm(ev) {
			ev.preventDefault();
			try {
				await this.apiClient.login(this.userid, this.password);
				await this.$root.loadUserInfo();
				this.error = null;
				if (this.redirect) {
					window.location.assign(this.redirect);
				} else {
					this.$router.push({name: 'home'});
				}
			} catch (e) {
				this.error = "login failed";
			}
			return false;
		},
		onCancel() {
			if (this.redirect) {
				window.location.assign(this.redirect);
			} else {
				this.$router.push({name: 'home'});
			}
		}
	}
}
</script>

<style>
.regform {
	width: 40em;
	margin: auto;
	margin-top: 5em;
}
.regform p {
	margin: 0.5em 0;
}
.regform .form-content {
	overflow: hidden;
}
.regform .buttons {
	float: right;
}
.regform .buttons .p-button {
	width: auto;
	margin-left: 0.5em;
}
.regform .error {
	float: left;
}
.regform .p-inputtext.p-component:invalid {
    border-color: #f44336;
}
.view-login .login-message {
	font-weight: bold;
	margin: 1.5em 0;	
}
</style>
