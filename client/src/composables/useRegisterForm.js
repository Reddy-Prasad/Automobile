import { useFormSubmit } from './useFormSubmit'
import { useAuthStore } from '@/stores/authStore'
import { validateRegister } from '@/utils/validate'

function emptyForm() {
  return { name: '', email: '', password: '', confirm: '' }
}

export function useRegisterForm() {
  const authStore = useAuthStore()

  return useFormSubmit({
    emptyForm,
    validate: validateRegister,
    send(form) {
      return authStore.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
    },
  })
}
