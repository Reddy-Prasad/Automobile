<script setup>
defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true },
})

defineEmits(['update:page'])
</script>

<template>
  <nav v-if="pageCount > 1" aria-label="Pagination">
    <ul class="pagination pagination-sm mb-0">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <button
          type="button"
          class="page-link"
          :disabled="page <= 1"
          @click="$emit('update:page', page - 1)"
        >
          Previous
        </button>
      </li>
      <li
        v-for="number in pageCount"
        :key="number"
        class="page-item"
        :class="{ active: number === page }"
      >
        <button type="button" class="page-link" @click="$emit('update:page', number)">
          {{ number }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: page >= pageCount }">
        <button
          type="button"
          class="page-link"
          :disabled="page >= pageCount"
          @click="$emit('update:page', page + 1)"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>
