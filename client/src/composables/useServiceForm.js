import { locations } from '@/data/dealer'
import { createServiceBooking } from '@/services/serviceBookingService'
import { validateServiceBooking } from '@/utils/validate'
import { useFormSubmit } from './useFormSubmit'

function emptyForm() {
  return {
    year: '',
    make: '',
    model: '',
    serviceType: '',
    date: '',
    time: '',
    locationId: '',
    name: '',
    phone: '',
  }
}

export function useServiceForm() {
  return useFormSubmit({
    emptyForm,
    validate: validateServiceBooking,
    async send(form) {
      const location = locations.find((item) => item.id === form.locationId)
      return createServiceBooking({
        year: Number(form.year),
        make: form.make.trim(),
        model: form.model.trim(),
        vehicleTitle: `${form.year} ${form.make.trim()} ${form.model.trim()}`,
        serviceType: form.serviceType,
        date: form.date,
        time: form.time,
        locationId: form.locationId,
        locationName: location?.name ?? form.locationId,
        name: form.name.trim(),
        phone: form.phone.trim(),
      })
    },
  })
}
