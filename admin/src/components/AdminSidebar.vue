<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { SIDEBAR_ITEMS } from '@/data/nav'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const { displayName, roleName } = storeToRefs(authStore)

const items = computed(() =>
  SIDEBAR_ITEMS.filter((item) => !item.permission || authStore.can(item.permission)),
)

async function onLogout() {
  await authStore.logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <aside class="admin-sidebar bg-dark text-white d-flex flex-column sticky-top min-vh-100">
    <div class="px-3 py-4 border-bottom border-secondary">
      <p class="h5 fw-bold mb-1">
        <i class="bi bi-clipboard-data me-2 text-warning"></i>AutoDrive Admin
      </p>
      <p class="small text-white-50 mb-0">Business operations, not website copy</p>
    </div>

    <nav class="flex-grow-1 px-2 py-3">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        class="d-flex align-items-center gap-2 px-3 py-2 mb-1 rounded text-decoration-none text-white-50"
        active-class="bg-secondary text-white"
        :to="{ name: item.to }"
      >
        <i :class="['bi', item.icon]"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="px-3 py-3 border-top border-secondary small">
      <p class="mb-1 text-white">{{ displayName }}</p>
      <p class="text-warning mb-3">{{ roleName }}</p>
      <button type="button" class="btn btn-outline-light btn-sm w-100" @click="onLogout">
        Sign out
      </button>
    </div>
  </aside>
</template>
