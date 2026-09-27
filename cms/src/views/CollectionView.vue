<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import DataTable from '@/components/DataTable.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { CONTENT_TYPES } from '@/data/contentTypes'
import { PERMISSIONS } from '@/data/roles'
import { STATUS } from '@/data/workflow'
import { useAuthStore } from '@/stores/authStore'
import { useContentStore } from '@/stores/contentStore'

const props = defineProps({
  type: { type: String, required: true },
})

const authStore = useAuthStore()
const contentStore = useContentStore()
const { items, status, error } = storeToRefs(contentStore)

const spec = computed(() => CONTENT_TYPES[props.type])
const columns = computed(() => [
  ...(spec.value.columns ?? []),
  { key: 'status', label: 'Status' },
  { key: 'updatedBy', label: 'Updated by' },
])

const pendingDelete = ref(null)

onMounted(load)
watch(() => props.type, load)

function load() {
  contentStore.loadList(props.type).catch(() => {})
}

function retry() {
  load()
}

async function confirmDelete() {
  if (!pendingDelete.value) return
  try {
    await contentStore.remove(props.type, pendingDelete.value.id)
    pendingDelete.value = null
  } catch {
    pendingDelete.value = null
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <p class="small text-uppercase text-primary fw-semibold mb-1">Content</p>
        <h1 class="h3 fw-bold mb-0">{{ spec.label }}</h1>
      </div>
      <RouterLink
        v-if="authStore.can(PERMISSIONS.CMS_DRAFT)"
        class="btn btn-primary"
        :to="{ name: `${type}-edit`, params: { id: 'new' } }"
      >
        New {{ spec.singular }}
      </RouterLink>
    </div>

    <div v-if="status === 'loading'" class="alert alert-secondary">Loading {{ spec.label.toLowerCase() }}…</div>
    <div v-else-if="status === 'error'" class="alert alert-danger">
      {{ error?.message }}
      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="retry">Retry</button>
    </div>
    <EmptyState
      v-else-if="status === 'empty'"
      title="No items yet"
      text="Create a draft. It stays off the client site until someone publishes it."
    />
    <div v-else class="card border-0 shadow-sm">
      <DataTable :columns="columns" :rows="items">
        <template #status="{ value }">
          <StatusBadge :status="value" />
        </template>
        <template #actions="{ row }">
          <RouterLink class="btn btn-sm btn-outline-primary me-2" :to="{ name: `${type}-edit`, params: { id: row.id } }">
            {{ row.status === STATUS.DRAFT && authStore.can(PERMISSIONS.CMS_DRAFT) ? 'Edit' : 'Open' }}
          </RouterLink>
          <button
            v-if="authStore.can(PERMISSIONS.CMS_DRAFT) && row.status !== STATUS.PUBLISHED"
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="pendingDelete = row"
          >
            Delete
          </button>
        </template>
      </DataTable>
    </div>

    <Modal
      :open="Boolean(pendingDelete)"
      title="Delete draft?"
      @close="pendingDelete = null"
      @confirm="confirmDelete"
    >
      This removes {{ pendingDelete?.headline || pendingDelete?.title || pendingDelete?.filename }} from
      the mock CMS. Published items must be unpublished first.
    </Modal>
  </div>
</template>
