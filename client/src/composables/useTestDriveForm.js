import { locations } from '@/data/dealer'
import { createCustomer } from '@/services/customerService'
import { createTestDrive } from '@/services/testDriveService'
import { validateTestDrive } from '@/utils/validate'
import { useFormSubmit } from './useFormSubmit'

function emptyForm() {
  return {
    vehicleId: '',
    date: '',
    time: '',
    locationId: '',
    name: '',
    phone: '',
  }
}

export function useTestDriveForm() {
  return useFormSubmit({
    emptyForm,
    validate: validateTestDrive,
    async send(form) {
      const location = locations.find((item) => item.id === form.locationId)
      const customer = await createCustomer({
        name: form.name.trim(),
        phone: form.phone.trim(),
      })
      return createTestDrive({
        vehicleId: Number(form.vehicleId),
        customerId: customer.id,
        customerName: customer.name,
        day: form.date,
        time: form.time,
        locationId: form.locationId,
        locationName: location?.name ?? form.locationId,
      })
    },
  })
}
