import { ref } from 'vue'

export const requestLog = ref([])

export function recordRequest(entry) {
  requestLog.value = [entry, ...requestLog.value].slice(0, 12)
}
