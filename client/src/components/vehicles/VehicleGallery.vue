<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  alt: { type: String, required: true },
})

const emit = defineEmits(['select'])

const selectedId = ref(props.items[0]?.id ?? '')

watch(
  () => props.items,
  (items) => {
    selectedId.value = items[0]?.id ?? ''
  },
)

const selected = computed(
  () => props.items.find((item) => item.id === selectedId.value) ?? props.items[0],
)

function select(item) {
  selectedId.value = item.id
  emit('select', item)
}
</script>

<template>
  <div>
    <div class="rounded-3 overflow-hidden bg-body-secondary mb-3">
      <img
        v-if="selected?.src"
        :src="selected.src"
        :alt="alt"
        class="w-100 object-fit-cover gallery-main"
        width="960"
        height="600"
      />
      <div
        v-else
        class="gallery-main d-flex flex-column align-items-center justify-content-center text-white"
        :style="{ backgroundColor: selected?.color }"
      >
        <i class="bi bi-palette display-4 mb-2"></i>
        <span class="fw-semibold">{{ selected?.label }}</span>
      </div>
    </div>

    <div class="d-flex gap-2">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="btn p-0 border rounded-3 overflow-hidden gallery-thumb"
        :class="selectedId === item.id ? 'border-primary border-2' : 'border-secondary-subtle'"
        :aria-pressed="selectedId === item.id"
        :aria-label="item.label"
        @click="select(item)"
      >
        <img
          v-if="item.src"
          :src="item.src"
          :alt="item.label"
          class="object-fit-cover gallery-thumb-media"
        />
        <span
          v-else
          class="gallery-thumb-media d-block"
          :style="{ backgroundColor: item.color }"
        ></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery-main {
  aspect-ratio: 16 / 10;
}

.gallery-thumb-media {
  width: 5.5rem;
  height: 3.5rem;
}
</style>
