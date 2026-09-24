import { reactive, ref } from 'vue'
import { failNextRequest } from '@/api/http'
import { createFinanceApplication } from '@/services/financeService'
import { validateFinanceApplication } from '@/utils/finance'

export function useFinanceApply() {
  const form = reactive({
    name: '',
    email: '',
    phone: '',
    employment: '',
    monthlyIncome: '',
    loanAmount: '',
    termMonths: 60,
  })

  const errors = ref({})
  const status = ref('initial')
  const error = ref(null)
  const record = ref(null)
  const submitted = ref(false)

  function validate() {
    errors.value = validateFinanceApplication(form)
    return Object.keys(errors.value).length === 0
  }

  function reset() {
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      employment: '',
      monthlyIncome: '',
      loanAmount: '',
      termMonths: 60,
    })
    errors.value = {}
    status.value = 'initial'
    error.value = null
    record.value = null
    submitted.value = false
  }

  function applyQuote({ loanAmount, termMonths }) {
    form.loanAmount = Math.round(loanAmount)
    form.termMonths = termMonths
  }

  async function submit(extra = {}) {
    submitted.value = true
    if (!validate()) {
      status.value = 'initial'
      return null
    }

    status.value = 'loading'
    error.value = null

    try {
      record.value = await createFinanceApplication({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        employment: form.employment,
        monthlyIncome: Number(form.monthlyIncome),
        loanAmount: Number(form.loanAmount),
        termMonths: Number(form.termMonths),
        source: 'finance-page',
        ...extra,
      })
      status.value = 'success'
      return record.value
    } catch (caught) {
      error.value = caught
      status.value = 'error'
      throw caught
    }
  }

  function simulateError() {
    failNextRequest()
    return submit()
  }

  return {
    form,
    errors,
    status,
    error,
    record,
    submitted,
    validate,
    submit,
    reset,
    applyQuote,
    simulateError,
  }
}
