<script setup>
import { STORE_OPTIONS, TIME_SLOTS, todayIso } from '@/data/booking'
import FormField from './FormField.vue'

defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, required: true },
  fieldClass: { type: Function, required: true },
})
</script>

<template>
  <div class="col-md-4">
    <FormField label="Date" for-id="booking-date" :error="errors.date">
      <input
        id="booking-date"
        v-model="form.date"
        type="date"
        :min="todayIso()"
        :class="fieldClass('date')"
      />
    </FormField>
  </div>
  <div class="col-md-4">
    <FormField label="Time" for-id="booking-time" :error="errors.time">
      <select id="booking-time" v-model="form.time" :class="fieldClass('time', 'select')">
        <option disabled value="">Select a time</option>
        <option v-for="slot in TIME_SLOTS" :key="slot" :value="slot">{{ slot }}</option>
      </select>
    </FormField>
  </div>
  <div class="col-md-4">
    <FormField label="Location" for-id="booking-location" :error="errors.locationId">
      <select
        id="booking-location"
        v-model="form.locationId"
        :class="fieldClass('locationId', 'select')"
      >
        <option disabled value="">Select a store</option>
        <option v-for="store in STORE_OPTIONS" :key="store.id" :value="store.id">
          {{ store.label }}
        </option>
      </select>
    </FormField>
  </div>
</template>
