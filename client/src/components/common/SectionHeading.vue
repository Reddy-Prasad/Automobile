<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  centered: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4"
    :class="{ 'text-center': centered }"
  >
    <div :class="{ 'mx-auto': centered }">
      <p v-if="eyebrow" class="text-primary fw-semibold text-uppercase small mb-1">
        {{ eyebrow }}
      </p>
      <h2 class="fw-bold mb-1">{{ title }}</h2>
      <p v-if="subtitle" class="text-body-secondary mb-0">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.actions" class="flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
