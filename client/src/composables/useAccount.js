import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/accountStore'
import { useAuthStore } from '@/stores/authStore'
import { useCompareStore } from '@/stores/compareStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useVehicleStore } from '@/stores/vehicleStore'
import { pageCount } from '@/utils/account'
import { paginate } from '@/utils/vehicles'

const PAGE_SIZE = 5

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'compare', label: 'Compare' },
  { id: 'test-drives', label: 'Test drives' },
  { id: 'service', label: 'Service appointments' },
  { id: 'finance', label: 'Finance applications' },
  { id: 'trade-ins', label: 'Trade-ins' },
]

function usePaged(list) {
  const page = ref(1)
  const rows = computed(() => paginate(list.value, page.value, PAGE_SIZE))
  const pages = computed(() => pageCount(list.value.length, PAGE_SIZE))
  return reactive({ page, rows, pages })
}

export function useAccount() {
  const accountStore = useAccountStore()
  const authStore = useAuthStore()
  const favoriteStore = useFavoriteStore()
  const compareStore = useCompareStore()
  const vehicleStore = useVehicleStore()

  const { user, roleName, token } = storeToRefs(authStore)
  const { status, error, mine } = storeToRefs(accountStore)
  const { vehicles: favorites, count: favoriteCount } = storeToRefs(favoriteStore)
  const { vehicles: compared, count: compareCount } = storeToRefs(compareStore)

  const drives = computed(() => mine.value.testDrives)
  const services = computed(() => mine.value.serviceBookings)
  const applications = computed(() => mine.value.financeApplications)
  const trades = computed(() => mine.value.tradeIns)

  const drivePage = usePaged(drives)
  const servicePage = usePaged(services)
  const financePage = usePaged(applications)
  const tradePage = usePaged(trades)

  const modal = reactive({
    open: false,
    title: 'Please confirm',
    message: '',
    confirmLabel: 'Confirm',
    danger: false,
    run: null,
  })

  function ask(options) {
    modal.open = true
    modal.title = options.title
    modal.message = options.message
    modal.confirmLabel = options.confirmLabel ?? 'Confirm'
    modal.danger = Boolean(options.danger)
    modal.run = options.run
  }

  function closeModal() {
    modal.open = false
    modal.run = null
  }

  async function confirmModal() {
    const run = modal.run
    closeModal()
    if (run) await run()
  }

  async function load() {
    await Promise.all([vehicleStore.loadVehicles().catch(() => {}), accountStore.load().catch(() => {})])
  }

  return {
    PAGE_SIZE,
    sections,
    user,
    roleName,
    token,
    status,
    error,
    favorites,
    favoriteCount,
    compared,
    compareCount,
    drives,
    services,
    applications,
    trades,
    drivePage,
    servicePage,
    financePage,
    tradePage,
    modal,
    accountStore,
    favoriteStore,
    compareStore,
    authStore,
    ask,
    closeModal,
    confirmModal,
    load,
    retry: load,
  }
}
