<template>
	<div class="view-recover regform">
		<Card>
			<!--<template #header>
				<img alt="user header" src="demo/images/usercard.png">
			</template>-->
			<template #title>
				Password reset
			</template>
			<template #content>
				<div v-if="user">
					<p>Reseting password for <b>{{user.username}}</b></p>
					<form @submit="submitForm">
						<div class="p-fluid form-content">
							<div class="p-field">
								<label for="password">Password</label>
								<InputText id="password" type="password" v-model="password"
									:class="passwordClass"
									v-on:change="checkPassword(true)"
									v-on:keyup="checkPassword(false)" />
								<small v-if="passwordError" class="p-error">{{passwordError}}</small>
							</div>
							<div class="p-field">
								<label for="password2">Re-type password</label>
								<InputText id="password2" type="password" v-model="password2"
									:class="password2Class"
									v-on:change="checkPassword(true)"
									v-on:keyup="checkPassword(false)" />
								<small v-if="password2Error" class="p-error">{{password2Error}}</small>
							</div>
							<div class="error" v-if="error">
								<InlineMessage severity="error">{{error}}</InlineMessage>
							</div>
							<div class="buttons">
								<Button icon="pi pi-check" label="Reset password" type="submit" :disabled="!isComplete" />
							</div>
						</div>
					</form>
				</div>
				<div v-else>
					<div class="error" v-if="error">
						<InlineMessage severity="error">{{error}}</InlineMessage>
					</div>
				</div>
			</template>
			<template #footer>
				<Message severity="success" v-if="accountCreated">
					Password successfully changed.
				</Message>
				<router-link to="/login">Sign in</router-link>!
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
	name: 'resetPassword',
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
			hash: null,
			user: null,
			password: '',
			password2: '',
			passwordError: '',
			passwordClass: '',
			password2Error: '',
			password2Class: '',
			error: '',
			useridClass: '',
			pwdok: false,
			accountCreated: false
		}
	},
	computed: {
		isComplete() {
			return this.pwdok;
		}
	},
	created () {
		this.apiClient = this.$root.apiClient;
		this.hash = this.$route.params.hash;
		if (this.hash) {
			this.apiClient.verifyChallenge(this.hash).then((data) => { this.user = data }, (error) => {this.error = error.message})
		} else {
			this.error = 'Invalid recovery code';
		}
	},
	methods: {
		async submitForm(ev) {
			ev.preventDefault();
			try {
				const data = {username: this.user.username, captchaToken: this.hash, password: this.password};
				await this.apiClient.resetPassword(data);
				this.error = null;
				this.accountCreated = true;
			} catch (e) {
				this.error = "Reset failed: " + e.message;
				this.error = e.message;
			}
			return false;
		},
		async checkPassword(final) {
			let ok = true;
			if (this.password.length < 6) {
				this.passwordError = 'Password must have at least 6 characters';
				this.passwordClass = 'p-invalid';
				ok = false;
			} else {
				this.passwordError = null;
			}

			if (this.password !== this.password2) {
				this.password2Error = 'Passwords don\'t match';
				this.password2Class = 'p-invalid';
				ok = false;
			} else {
				this.password2Error = null;
			}

			this.pwdok = ok;
			if (ok) {
				if (final) {
					this.password2Class = this.passwordClass = 'ok';
				} else {
					this.password2Class = this.passwordClass = '';
				}
			}		
		}
	}
}
</script>

<style>
</style>
