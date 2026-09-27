<script setup>
import CmsSidebar from '@/components/CmsSidebar.vue'
</script>

<template>
  <div class="cms-shell d-flex">
    <a class="skip-link btn btn-primary visually-hidden-focusable" href="#main-content">
      Skip to main content
    </a>
    <CmsSidebar />
    <main id="main-content" class="flex-grow-1 bg-body-tertiary min-vh-100" tabindex="-1">
      <div class="p-4 p-lg-5">
        <RouterView />
      </div>
    </main>
  </div>
</template>
