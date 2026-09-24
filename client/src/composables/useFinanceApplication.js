import { reactive, ref } from 'vue'
import { createFinanceApplication } from '@/services/financeService'

export function useFinanceApplication() {
  const form = reactive({
    name: '',
    email: '',
    downPayment: 5000,
    termMonths: 60,
  })
  const status = ref('initial')
  const error = ref(null)
  const record = ref(null)

  function reset() {
    Object.assign(form, { name: '', email: '', downPayment: 5000, termMonths: 60 })
    status.value = 'initial'
    error.value = null
    record.value = null
  }

  async function submit(vehicle) {
    status.value = 'loading'
    error.value = null

    try {
      record.value = await createFinanceApplication({
        vehicleId: vehicle.id,
        vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        price: vehicle.price,
        name: form.name,
        email: form.email,
        downPayment: Number(form.downPayment),
        termMonths: Number(form.termMonths),
        apr: 6.9,
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
