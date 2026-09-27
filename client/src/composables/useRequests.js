import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/accountStore'

export function useRequests() {
  const accountStore = useAccountStore()
  const { testDrives, financeApplications, serviceBookings, tradeIns, status, error } =
    storeToRefs(accountStore)

  return {
    testDrives,
    applications: financeApplications,
    serviceBookings,
    tradeIns,
    status,
    error,
    load: () => accountStore.load(),
    retry: () => accountStore.load(),
    confirmDrive: (id) => accountStore.confirmDrive(id),
    cancelDrive: (id) => accountStore.cancelDrive(id),
    updateApplication: (application, changes) =>
      accountStore.updateApplication(application, changes),
    removeApplication: (id) => accountStore.removeApplication(id),
    cancelService: (id) => accountStore.cancelService(id),
    cancelTradeIn: (id) => accountStore.cancelTradeIn(id),
  }
}
