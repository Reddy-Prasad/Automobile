<script setup>
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
})

const emit = defineEmits(['close', 'confirm'])
const dialog = ref(null)
const titleId = 'admin-modal-title'

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
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
    class="position-fixed top-0 start-0 w-100 h-100"
    style="z-index: 1050"
    role="presentation"
  >
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" @click="emit('close')" />
    <div class="position-relative d-flex align-items-center justify-content-center h-100 p-3">
      <div
        ref="dialog"
        class="card shadow"
        style="max-width: 420px; width: 100%"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div class="card-body p-4">
          <h2 :id="titleId" class="h5">{{ title }}</h2>
          <div class="text-body-secondary mb-4">
            <slot />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="emit('close')">Cancel</button>
            <button type="button" class="btn btn-danger" @click="emit('confirm')">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
