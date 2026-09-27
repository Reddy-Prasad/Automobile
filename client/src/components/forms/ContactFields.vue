<script setup>
import FormField from './FormField.vue'

defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, required: true },
  fieldClass: { type: Function, required: true },
  email: { type: Boolean, default: false },
})
</script>

<template>
  <div class="col-md-6">
    <FormField label="Name" for-id="booking-name" :error="errors.name">
      <input id="booking-name" v-model.trim="form.name" :class="fieldClass('name')" />
    </FormField>
  </div>
  <div v-if="email" class="col-md-6">
    <FormField label="Email" for-id="booking-email" :error="errors.email">
      <input
        id="booking-email"
        v-model.trim="form.email"
        type="email"
        :class="fieldClass('email')"
      />
    </FormField>
  </div>
  <div v-else class="col-md-6">
    <FormField label="Phone" for-id="booking-phone" :error="errors.phone">
      <input
        id="booking-phone"
        v-model.trim="form.phone"
        type="tel"
        placeholder="(214) 555-0199"
        :class="fieldClass('phone')"
      />
    </FormField>
  </div>
</template>
