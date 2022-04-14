<template>
	<div class="view-users">

	<h1>User administration</h1>
	<div class="user-list">
		<DataTable :value="users" editMode="row" dataKey="username" v-model:editingRows="editingRows"
                @rowEditInit="onRowEditInit" @rowEditSave="onRowEditSave" @rowEditCancel="onRowEditCancel"
				@rowClick="onRowClick" 
				responsiveLayout="scroll">
			<Column field="username" header="User ID"></Column>
			<Column field="name" header="Name">
				<template #editor="slotProps">
					<InputText v-model="slotProps.data[slotProps.column.props.field]" autofocus />
				</template>			
			</Column>
			<Column field="email" header="E-mail">
				<template #editor="slotProps">
					<InputText v-model="slotProps.data[slotProps.column.props.field]" autofocus />
				</template>			
			</Column>
			<Column field="roles" header="Roles">
				<template #editor="slotProps">
				 	<div class="p-field-checkbox">
						<Checkbox id="user" name="user" value="user" v-model="slotProps.data[slotProps.column.props.field]" />
						<label for="user">user</label>
					</div>
				 	<div class="p-field-checkbox">
						<Checkbox id="admin" name="admin" value="admin" v-model="slotProps.data[slotProps.column.props.field]" />
						<label for="admin">admin</label>
					</div>
				</template>			
			</Column>
			<Column :rowEditor="true" style="width: 10%; min-width:8rem" bodyStyle="text-align:center"></Column>
			<Column>
				<template #body="slotProps">
					<Button icon="pi pi-ellipsis-v" class="p-button-text" @click="(ev) => toggleOp(ev, slotProps)" />
				</template>
			</Column>			
		</DataTable>
		<ContextMenu :model="menuModel" ref="cm" />
		<ConfirmDialog></ConfirmDialog>
		<Dialog :modal="true" v-model:visible="pwdDialogShow" >
			<h3>New password for {{contextUser ? contextUser.username : '?'}}</h3>
			<form @submit="passwordSubmit">
				<div class="p-formgroup-inline">
					<div class="p-field">
						<label for="newpwd" class="p-sr-only">New password</label>
						<InputText ref="newpwd" id="newpwd" type="password" placeholder="New password" v-model="newPassword" />
					</div>
					<Button type="submit" label="Change" />
				</div>
			</form>			
		</Dialog>		
	</div>

	</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import ContextMenu from 'primevue/contextmenu';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';

export default {
	name: 'adminUsers',
	components: {
		DataTable,
		Column,
		InputText,
		Checkbox,
		ContextMenu,
		Button,
		ConfirmDialog,
		Dialog
	},
	//inject: ['apiClient'],
	data() {
		return {
			apiClient: null,
			users: [],
			editingRows: [],
			contextUser: null,
			contextEv: null,
			menuModel: [
                {label: 'Change password', icon: 'pi pi-fw pi-key', command: () => this.changePassword()},
                {label: 'Delete', icon: 'pi pi-fw pi-times', command: (ev) => this.deleteUser(ev)}
			],
			pwdDialogShow: false,
			newPassword: null
		}
	},
	originalRows: null,
	created () {
		this.apiClient = this.$root.apiClient;
		this.originalRows = {};
	},
	mounted() {
        this.refresh();
    },	
	methods: {
		refresh() {
			this.apiClient.getUsers().then(data => this.users = data);
		},
		onRowEditInit(event) {
            this.originalRows[event.index] = {...this.users[event.index]};
		},
        onRowEditSave(event) {
			const userdata = this.users[event.index];
			this.apiClient.updateUser(userdata);
        },
        onRowEditCancel(event) {
            this.users[event.index] = this.originalRows[event.index];
		},
		onRowClick(event) {
			console.log('click');
		},
		toggleOp(ev, slotProps) {
			this.contextEv = ev;
			this.contextUser = slotProps.data;
			this.$refs.cm.show(ev);
		},
		changePassword() {
			this.newPassword = '';
			this.pwdDialogShow = true;
		},
		async passwordSubmit(ev) {
			ev.preventDefault();
			try {
				await this.$root.apiClient.updatePassword(this.contextUser, this.newPassword);
			} catch (e) {
				console.log(e.message);
			}
			this.pwdDialogShow = false;
			return false;
		},
		async deleteUser(event) {
			const username = this.contextUser.username;
			this.$confirm.require({
				message: 'Are you sure you want to delete user ' + username + '?',
				header: 'User deletion',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
					await this.apiClient.deleteUser(this.contextUser);
					this.refresh();
                },
                reject: () => {
                }
            });
		}
	}
}
</script>

<style>
.view-users {
	margin: 2em;
}
</style>
