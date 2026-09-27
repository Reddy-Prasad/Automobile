<script setup>
import { computed } from 'vue'
import { ACTION_LABELS, TRANSITIONS } from '@/data/workflow'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  status: { type: String, required: true },
  busy: { type: Boolean, default: false },
})

const emit = defineEmits(['action'])

const authStore = useAuthStore()

const actions = computed(() =>
  Object.entries(TRANSITIONS)
    .filter(([, rule]) => rule.from === props.status && authStore.can(rule.permission))
    .map(([id]) => ({ id, label: ACTION_LABELS[id] })),
)

const buttonClass = {
  submit: 'btn-outline-primary',
  approve: 'btn-info',
  reject: 'btn-outline-warning',
  publish: 'btn-success',
  unpublish: 'btn-outline-danger',
}
</script>

<template>
  <div class="d-flex flex-wrap gap-2">
    <button
      v-for="action in actions"
      :key="action.id"
      type="button"
      class="btn"
      :class="buttonClass[action.id] ?? 'btn-outline-secondary'"
      :disabled="busy"
      @click="emit('action', action.id)"
    >
      {{ action.label }}
    </button>
    <p v-if="!actions.length" class="small text-body-secondary mb-0 align-self-center">
      No workflow actions for this role and status.
    </p>
  </div>
</template>
