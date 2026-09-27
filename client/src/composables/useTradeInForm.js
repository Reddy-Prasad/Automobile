import { computed, watch } from 'vue'
import { createTradeIn } from '@/services/tradeInService'
import { estimateTradeValue } from '@/utils/tradeIn'
import { validateTradeIn } from '@/utils/validate'
import { useFormSubmit } from './useFormSubmit'

function emptyForm() {
  return {
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: 'Good',
    expectedValue: '',
    name: '',
    email: '',
  }
}

export function useTradeInForm() {
  const flow = useFormSubmit({
    emptyForm,
    validate: validateTradeIn,
    async send(form) {
      return createTradeIn({
        make: form.make.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        mileage: Number(form.mileage),
        condition: form.condition,
        expectedValue: Number(form.expectedValue),
        vehicleTitle: `${form.year} ${form.make.trim()} ${form.model.trim()}`,
        name: form.name.trim(),
        email: form.email.trim(),
      })
    },
  })

  const suggestedValue = computed(() =>
    estimateTradeValue({
      year: flow.form.year,
      mileage: flow.form.mileage,
      condition: flow.form.condition,
    }),
  )

  watch(suggestedValue, (value) => {
    if (!flow.submitted.value) flow.form.expectedValue = value
  })

  return { ...flow, suggestedValue }
}
