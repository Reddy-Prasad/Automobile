<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Please confirm' },
  confirmLabel: { type: String, default: 'Confirm' },
  danger: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
const dialog = ref(null)
const titleId = 'shared-modal-title'

function onKeydown(event) {
  if (event.key === 'Escape') emit('cancel')
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      dialog.value?.querySelector('button')?.focus()
      return
    }
    window.removeEventListener('keydown', onKeydown)
  },
  { immediate: true },
)

onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    v-if="open"
    ref="dialog"
    class="modal d-block"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 :id="titleId" class="modal-title h5">{{ title }}</h2>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('cancel')"></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
            Cancel
          </button>
          <button
            type="button"
            class="btn"
            :class="danger ? 'btn-danger' : 'btn-primary'"
            @click="$emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="open" class="modal-backdrop fade show"></div>
</template>
