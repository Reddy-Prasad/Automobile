import { computed, reactive, ref } from 'vue'
import { failNextRequest } from '@/api/http'

export function useFormSubmit({ emptyForm, validate, send }) {
  const form = reactive(emptyForm())
  const errors = ref({})
  const status = ref('initial')
  const error = ref(null)
  const record = ref(null)
  const submitted = ref(false)

  const isLoading = computed(() => status.value === 'loading')
  const isComplete = computed(() => Object.keys(validate(form)).length === 0)
  const submitDisabled = computed(() => isLoading.value || !isComplete.value)

  function fieldClass(name, kind = 'control') {
    const base = kind === 'select' ? 'form-select' : 'form-control'
    return submitted.value && errors.value[name] ? `${base} is-invalid` : base
  }

  function reset() {
    Object.assign(form, emptyForm())
    errors.value = {}
    status.value = 'initial'
    error.value = null
    record.value = null
    submitted.value = false
  }

  async function submit(extra = {}) {
    submitted.value = true
    errors.value = validate(form)
    if (Object.keys(errors.value).length) {
      status.value = 'initial'
      return null
    }

    status.value = 'loading'
    error.value = null

    try {
      record.value = await send(form, extra)
      status.value = 'success'
      return record.value
    } catch (caught) {
      error.value = caught
      status.value = 'error'
      return null
    }
  }

  function retry() {
    return submit()
  }

  function simulateError() {
    submitted.value = true
    errors.value = validate(form)
    if (Object.keys(errors.value).length) {
      status.value = 'initial'
      return null
    }
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
    isLoading,
    isComplete,
    submitDisabled,
    fieldClass,
    submit,
    reset,
    retry,
    simulateError,
  }
}
