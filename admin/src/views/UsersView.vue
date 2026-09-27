<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DataTable from '@/components/DataTable.vue'
import { ROLES, roleLabel } from '@/data/roles'
import { useOperationsStore } from '@/stores/operationsStore'

const operations = useOperationsStore()
const { items, status, error } = storeToRefs(operations)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'app', label: 'Home app' },
]

onMounted(() => operations.loadUsers())

function onRole(row, event) {
  operations.changeRole(row.id, event.target.value)
}
</script>

<template>
  <div>
    <h1 class="h3 fw-bold mb-4">Users</h1>
    <div v-if="status === 'error'" class="alert alert-danger">{{ error?.message }}</div>
    <div v-else-if="status === 'loading'" class="alert alert-secondary">Loading users…</div>
    <div v-else class="card border-0 shadow-sm">
      <DataTable :columns="columns" :rows="items">
        <template #role="{ row, value }">
          <select class="form-select form-select-sm" :value="value" @change="onRole(row, $event)">
            <option v-for="role in Object.values(ROLES)" :key="role" :value="role">
              {{ roleLabel(role) }}
            </option>
            <option value="CUSTOMER">Customer</option>
            <option value="CMS_EDITOR">CMS editor</option>
            <option value="CMS_REVIEWER">CMS reviewer</option>
          </select>
        </template>
      </DataTable>
    </div>
  </div>
</template>
