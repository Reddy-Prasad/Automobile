<script setup>
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import DataTable from '@/components/DataTable.vue'
import EmptyState from '@/components/EmptyState.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { BOARDS } from '@/data/boards'
import { useAuthStore } from '@/stores/authStore'
import { useOperationsStore } from '@/stores/operationsStore'

const props = defineProps({
  type: { type: String, required: true },
})

const authStore = useAuthStore()
const operations = useOperationsStore()
const { items, status, error } = storeToRefs(operations)
const spec = computed(() => BOARDS[props.type])
const canWrite = computed(() => {
  const permission = spec.value.writePermission
  return permission ? authStore.can(permission) : false
})

onMounted(load)
watch(() => props.type, load)

function load() {
  operations.loadBoard(props.type)
}

async function onStatus(row, event) {
  await operations.updateItem(props.type, row.id, { status: event.target.value })
}
</script>

<template>
  <div>
    <p class="small text-uppercase text-primary fw-semibold mb-1">Operations</p>
    <h1 class="h3 fw-bold mb-4">{{ spec.label }}</h1>

    <div v-if="status === 'loading'" class="alert alert-secondary">Loading…</div>
    <div v-else-if="status === 'error'" class="alert alert-danger">{{ error?.message }}</div>
    <EmptyState v-else-if="status === 'empty'" title="No records" />
    <div v-else class="card border-0 shadow-sm">
      <DataTable :columns="spec.columns" :rows="items">
        <template #status="{ row, value }">
          <select
            v-if="canWrite && spec.statusOptions"
            class="form-select form-select-sm"
            :value="value"
            @change="onStatus(row, $event)"
          >
            <option v-for="option in spec.statusOptions" :key="option" :value="option">{{ option }}</option>
          </select>
          <StatusBadge v-else :status="value" />
        </template>
      </DataTable>
    </div>
  </div>
</template>
