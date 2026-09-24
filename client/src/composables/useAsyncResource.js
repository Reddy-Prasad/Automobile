import { ref } from 'vue'

export function useAsyncResource() {
  const status = ref('initial')
  const error = ref(null)

  async function run(loader) {
    status.value = 'loading'
    error.value = null

    try {
      const result = await loader()
      const isEmpty = result == null || (Array.isArray(result) && result.length === 0)
      status.value = isEmpty ? 'empty' : 'success'
      return result
    } catch (caught) {
      error.value = caught
      status.value = 'error'
      throw caught
    }
  }

  return { status, error, run }
}
