import { ref } from 'vue'
import {
  deleteFinanceApplication,
  listFinanceApplications,
  replaceFinanceApplication,
} from '@/services/financeService'
import { deleteServiceBooking, listServiceBookings } from '@/services/serviceBookingService'
import { deleteTestDrive, listTestDrives, patchTestDrive } from '@/services/testDriveService'
import { deleteTradeIn, listTradeIns } from '@/services/tradeInService'
import { useAsyncResource } from './useAsyncResource'

export function useRequests() {
  const testDrives = ref([])
  const applications = ref([])
  const serviceBookings = ref([])
  const tradeIns = ref([])
  const { status, error, run } = useAsyncResource()

  async function load() {
    try {
      const result = await run(async () => {
        const [nextDrives, nextFinance, nextService, nextTrade] = await Promise.all([
          listTestDrives(),
          listFinanceApplications(),
          listServiceBookings(),
          listTradeIns(),
        ])
        return {
          drives: nextDrives,
          finance: nextFinance,
          service: nextService,
          trade: nextTrade,
        }
      })
      testDrives.value = result.drives
      applications.value = result.finance
      serviceBookings.value = result.service
      tradeIns.value = result.trade
      const none =
        !result.drives.length &&
        !result.finance.length &&
        !result.service.length &&
        !result.trade.length
      if (none) status.value = 'empty'
    } catch {
      testDrives.value = []
      applications.value = []
      serviceBookings.value = []
      tradeIns.value = []
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

  async function cancelService(id) {
    await deleteServiceBooking(id)
    return load()
  }

  async function cancelTradeIn(id) {
    await deleteTradeIn(id)
    return load()
  }

  return {
    testDrives,
    applications,
    serviceBookings,
    tradeIns,
    status,
    error,
    load,
    retry: load,
    confirmDrive,
    cancelDrive,
    updateApplication,
    removeApplication,
    cancelService,
    cancelTradeIn,
  }
}
