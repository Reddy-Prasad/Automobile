import { reactive, ref } from 'vue'
import { createCustomer } from '@/services/customerService'
import { createTestDrive } from '@/services/testDriveService'

export function useTestDriveRequest() {
  const form = reactive({
    name: '',
    phone: '',
    email: '',
    day: '',
  })
  const status = ref('initial')
  const error = ref(null)
  const record = ref(null)

  function reset() {
    Object.assign(form, { name: '', phone: '', email: '', day: '' })
    status.value = 'initial'
    error.value = null
    record.value = null
  }

  async function submit(vehicleId) {
    status.value = 'loading'
    error.value = null

    try {
      const customer = await createCustomer({
        name: form.name,
        phone: form.phone,
        email: form.email,
      })
      record.value = await createTestDrive({
        vehicleId: Number(vehicleId),
        customerId: customer.id,
        customerName: customer.name,
        day: form.day,
      })
      status.value = 'success'
      return record.value
    } catch (caught) {
      error.value = caught
      status.value = 'error'
      throw caught
    }
  }

  return { form, status, error, record, submit, reset }
}
