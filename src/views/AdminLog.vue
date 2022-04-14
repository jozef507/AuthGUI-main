<template>
	<div class="view-log">

	<h1>Log</h1>
	<div class="log-list">
		<DataTable :value="entries" dataKey="id" 
				responsiveLayout="scroll">
			<Column field="id" header="ID"></Column>
			<Column field="timestamp" header="Timestamp" :sortable="true"></Column>
			<Column field="realm" header="Realm" :sortable="true"></Column>
			<Column field="action" header="Action" :sortable="true"></Column>
			<Column field="subject" header="Subject" :sortable="true"></Column>
			<Column field="description" header="Description" :sortable="true"></Column>
		</DataTable>
	</div>

	</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
	name: 'adminLog',
	components: {
		DataTable,
		Column
	},
	//inject: ['apiClient'],
	data() {
		return {
			apiClient: null,
			entries: [],
		}
	},
	created () {
		this.apiClient = this.$root.apiClient;
	},
	mounted() {
        this.refresh();
    },	
	methods: {
		refresh() {
			this.apiClient.getLogEntries().then(data => this.entries = data);
		}
	}
}
</script>

<style>
.view-log {
	margin: 2em;
}
</style>
