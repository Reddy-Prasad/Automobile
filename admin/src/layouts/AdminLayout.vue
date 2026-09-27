<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
</script>

<template>
  <div class="d-flex min-vh-100">
    <a class="skip-link btn btn-primary visually-hidden-focusable" href="#main-content">
      Skip to main content
    </a>
    <AdminSidebar />
    <main id="main-content" class="flex-grow-1 bg-body-tertiary" tabindex="-1">
      <div class="p-4 p-lg-5">
        <RouterView />
      </div>
    </main>
  </div>
</template>
