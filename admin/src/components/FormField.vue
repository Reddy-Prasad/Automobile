<script setup>
import { onMounted, onUpdated, watch } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  forId: { type: String, required: true },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
})

function bindControl() {
  const el = document.getElementById(props.forId)
  if (!el) return
  el.setAttribute('aria-invalid', props.error ? 'true' : 'false')
  if (props.error) el.setAttribute('aria-describedby', `${props.forId}-error`)
  else if (props.hint) el.setAttribute('aria-describedby', `${props.forId}-hint`)
  else el.removeAttribute('aria-describedby')
}

onMounted(bindControl)
onUpdated(bindControl)
watch(() => [props.error, props.hint, props.forId], bindControl)
</script>

<template>
  <div>
    <label :for="forId" class="form-label small fw-semibold">{{ label }}</label>
    <slot />
    <div v-if="error" :id="`${forId}-error`" class="invalid-feedback d-block">{{ error }}</div>
    <div v-else-if="hint" :id="`${forId}-hint`" class="form-text">{{ hint }}</div>
  </div>
</template>
