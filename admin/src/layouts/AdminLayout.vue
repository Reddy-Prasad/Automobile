<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
</script>

<template>
  <div class="d-flex min-vh-100">
    <AdminSidebar />
    <main class="flex-grow-1 bg-body-tertiary">
      <div class="p-4 p-lg-5">
        <RouterView />
      </div>
    </main>
  </div>
</template>
