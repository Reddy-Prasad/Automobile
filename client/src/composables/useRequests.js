import { ref } from 'vue'
import {
  deleteFinanceApplication,
  listFinanceApplications,
  replaceFinanceApplication,
} from '@/services/financeService'
import { deleteTestDrive, listTestDrives, patchTestDrive } from '@/services/testDriveService'
import { useAsyncResource } from './useAsyncResource'

export function useRequests() {
  const testDrives = ref([])
  const applications = ref([])
  const { status, error, run } = useAsyncResource()

  async function load() {
    try {
      const result = await run(async () => {
        const [nextDrives, nextFinance] = await Promise.all([
          listTestDrives(),
          listFinanceApplications(),
        ])
        return { drives: nextDrives, finance: nextFinance }
      })
      testDrives.value = result.drives
      applications.value = result.finance
      if (!result.drives.length && !result.finance.length) status.value = 'empty'
    } catch {
      testDrives.value = []
      applications.value = []
    }
  }

  async function confirmDrive(id) {
    await patchTestDrive(id, { status: 'confirmed' })
    return load()
  }

  async function cancelDrive(id) {
    await deleteTestDrive(id)
    return load()
  }

  async function updateApplication(application, changes) {
    await replaceFinanceApplication(application.id, { ...application, ...changes })
    return load()
  }

  async function removeApplication(id) {
    await deleteFinanceApplication(id)
    return load()
  }

  return {
    testDrives,
    applications,
    status,
    error,
    load,
    retry: load,
    confirmDrive,
    cancelDrive,
    updateApplication,
    removeApplication,
  }
}
