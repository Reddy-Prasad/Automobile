import { useFormSubmit } from './useFormSubmit'
import { useAuthStore } from '@/stores/authStore'
import { validateLogin } from '@/utils/validate'

function emptyForm() {
  return { email: '', password: '' }
}

export function useLoginForm() {
  const authStore = useAuthStore()

  return useFormSubmit({
    emptyForm,
    validate: validateLogin,
    send(form) {
      return authStore.login({
        email: form.email.trim(),
        password: form.password,
      })
    },
  })
}
