<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useOperationsStore } from '@/stores/operationsStore'

const operations = useOperationsStore()
const form = reactive({ name: '', phone: '', email: '', hours: '' })
const message = ref('')

onMounted(async () => {
  const settings = await operations.loadSettings()
  Object.assign(form, settings)
})

async function onSave() {
  await operations.saveSettings(form)
  message.value = 'Saved in the admin mock. The client still reads dealer.js until a real API exists.'
}
</script>

<template>
  <div>
    <h1 class="h3 fw-bold mb-3">Settings</h1>
    <div v-if="message" class="alert alert-info">{{ message }}</div>
    <form class="card border-0 shadow-sm" @submit.prevent="onSave">
      <div class="card-body p-4 row g-3">
        <div class="col-md-6">
          <label class="form-label">Dealership name</label>
          <input v-model="form.name" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Phone</label>
          <input v-model="form.phone" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input v-model="form.email" class="form-control" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Hours</label>
          <input v-model="form.hours" class="form-control" />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit">Save settings</button>
        </div>
      </div>
    </form>
  </div>
</template>
