<template>
	<div class="view-recover regform">
		<Card>
			<!--<template #header>
				<img alt="user header" src="demo/images/usercard.png">
			</template>-->
			<template #title>
				Forgotten password
			</template>
			<template #content>
				<form @submit="submitForm">
					<div class="p-fluid form-content">
						<div class="p-field">
							<label for="userId">Your User ID or E-mail</label>
							<InputText id="userId" type="text" v-model="userid"
								:class="useridClass"
								v-on:change="checkUsername(true)"
								v-on:keyup="checkUsername(false)" />
							<small>We will send you password recovery instructions to your e-mail (if it was provided during registration)</small>
						</div>
						<div class="error" v-if="error">
							<InlineMessage severity="error">{{error}}</InlineMessage>
						</div>
						<div class="buttons">
							<Button icon="pi pi-check" label="Reset password" type="submit" :disabled="!isComplete" />
						</div>
					</div>
				</form>
			</template>
			<template #footer>
				<Message severity="success" v-if="accountCreated">
					We have sent you an e-mail with password recovery instructions. Please check your mailbox.
				</Message>
				If you know your password, you may just <router-link to="/login">Sign in</router-link>!
			</template>
		</Card>

	</div>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';
import Message from 'primevue/message';

export default {
	name: 'recoverPassword',
	components: {
		Card,
		Button,
		InputText,
		InlineMessage,
		Message
	},
	//inject: ['apiClient'],
	data() {
		return {
			apiClient: null,
			userid: '',
			error: '',
			useridClass: '',
			userok: false,
			accountCreated: false
		}
	},
	computed: {
		isComplete() {
			return this.userok;
		}
	},
	created () {
		this.apiClient = this.$root.apiClient;
	},
	methods: {
		async submitForm(ev) {
			ev.preventDefault();
			try {
				const token = await this.recaptcha();
				if (token) {
					await this.apiClient.recoverPassword(this.userid, token);
					this.error = null;
					this.accountCreated = true;
				}
			} catch (e) {
				this.error = "Failed: " + e.message;
				this.error = e.message;
			}
			return false;
		},
		async recaptcha() {
			console.log('recaptcha clicked')
			await this.$recaptchaLoaded();
			const token = await this.$recaptcha('recover');
			console.log('Token: ' + token);
			return token;
 		},
		async checkUsername(final) {
			if (this.userid.length < 3) {
				this.useridClass = 'p-invalid';
				this.userok = false;
			} else {
				this.useridClass = final ? 'ok' : '';
				this.userok = true;
			}
			this.error = false;
		}
	}
}
</script>

<style>
</style>
