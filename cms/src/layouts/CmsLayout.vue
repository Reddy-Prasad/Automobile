<script setup>
import CmsSidebar from '@/components/CmsSidebar.vue'
</script>

<template>
  <div class="cms-shell d-flex">
    <CmsSidebar />
    <main class="flex-grow-1 bg-body-tertiary min-vh-100">
      <div class="p-4 p-lg-5">
        <RouterView />
      </div>
    </main>
  </div>
</template>
