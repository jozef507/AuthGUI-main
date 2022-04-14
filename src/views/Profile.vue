<template>
	<div class="view-profile">
		<div v-if="userInfo && userInfo.value && pUserInfo">
			<h1 class="item user-username">
				{{pUserInfo.username || '(no username)'}}
			</h1>
			<div class="item user-name">
				<Inplace :closable="true" @close="updateUser">
					<template #display>
						{{pUserInfo.name || '(no name)'}} <i class="pi pi-pencil"></i>
					</template>
					<template #content>
						<InputText v-model="pUserInfo.name" autoFocus />
					</template>
				</Inplace>
			</div>
			<div class="item user-email">
				<Inplace :closable="true" @close="updateUser">
					<template #display>
						{{pUserInfo.email || '(no e-mail)'}} <i class="pi pi-pencil"></i>
					</template>
					<template #content>
						<InputText type="email" v-model="pUserInfo.email" autoFocus />
					</template>
				</Inplace>
			</div>
		</div>

		<div class="card">
            <h4>Password change</h4>
			
			<form @submit="submitForm">
				<div class="p-fluid">
					<div class="p-field">
						<label for="oldpwd">Current password</label>
						<InputText id="oldpwd" type="password" v-model="oldPassword" />
					</div>
					<div class="p-field">
						<label for="newpwd1">New password</label>
						<InputText id="newpwd1" type="password" v-model="password"
									:class="passwordClass"
									v-on:change="checkPassword(true)"
									v-on:keyup="checkPassword(false)" />
						<small v-if="passwordError" class="p-error">{{passwordError}}</small>
					</div>
					<div class="p-field">
						<label for="newpwd2">Re-type new password</label>
						<InputText id="newpwd2" type="password" v-model="password2"
									:class="password2Class"
									v-on:change="checkPassword(true)"
									v-on:keyup="checkPassword(false)" />
						<small v-if="password2Error" class="p-error">{{password2Error}}</small>
					</div>
					<div class="error" v-if="error">
						<InlineMessage severity="error">{{error}}</InlineMessage>
					</div>
					<div class="buttons">
						<Button icon="pi pi-check" label="Change password" type="submit" :disabled="!pwdok" />
					</div>
					<div class="message" v-if="message">
						<InlineMessage severity="success">{{message}}</InlineMessage>
					</div>
				</div>
			</form>
        </div>

	</div>
</template>

<script>
import Inplace from 'primevue/inplace';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InlineMessage from 'primevue/inlinemessage';


export default {
	name: 'profile',
	components: {
		Inplace,
		InputText,
		Button,
		InlineMessage
	},
	inject: ['userInfo'],
	data() {
		return {
			pUserInfo: null,
			oldPassword: '',
			password: '',
			password2: '',
			message: '',
			error: '',
			passwordError: '',
			passwordClass: '',
			password2Error: '',
			password2Class: '',
			pwdok: false
		}
	},
	mounted() {
		this.pUserInfo = {...this.userInfo.value};
	},
	beforeUpdate() {
		this.pUserInfo = {...this.userInfo.value};
	},
	methods: {
		async updateUser() {
			await this.$root.apiClient.updateCurrentUser(this.pUserInfo);
			await this.$root.loadUserInfo();
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
		},
		async submitForm(ev) {
			ev.preventDefault();
			try {
				await this.$root.apiClient.updateCurrentUserPassword(this.oldPassword, this.password);
				this.message = 'Password updated ok';
				this.error = null;
			} catch (e) {
				this.error = e.message;
				this.message = null;
			}
			return false;
		}

	}
}
</script>

<style>
.view-profile {
	padding: 2em;
}
.view-profile .item {
	margin: 0.5em 0;
}
.view-profile .user-name > .p-component {
	font-size: 2em;
}
.view-profile .user-username {
	font-size: 1.5em;
	margin-left: 0.5rem;
	border-bottom: 1px solid black;
}
.card {
	background: var(--surface-e);
	padding: 2rem;
	box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12);
	border-radius: 4px;
	margin-bottom: 2rem;
}
</style>
