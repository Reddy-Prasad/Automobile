<script setup>
import ApiLogBar from '@/components/common/ApiLogBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />

    <main class="flex-grow-1">
      <RouterView />
    </main>

    <ApiLogBar />
    <AppFooter />
  </div>
</template>
