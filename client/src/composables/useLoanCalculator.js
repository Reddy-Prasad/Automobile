import { computed, ref } from 'vue'
import { calculateLoan, TERM_OPTIONS } from '@/utils/finance'

export function useLoanCalculator(initial = {}) {
  const vehiclePrice = ref(Number(initial.vehiclePrice) || 35000)
  const downPayment = ref(Number(initial.downPayment) || 5000)
  const apr = ref(Number(initial.apr) || 6.9)
  const termMonths = ref(Number(initial.termMonths) || 60)

  const quote = computed(() =>
    calculateLoan({
      vehiclePrice: vehiclePrice.value,
      downPayment: downPayment.value,
      apr: apr.value,
      termMonths: termMonths.value,
    }),
  )

  const loanAmount = computed(() => quote.value.loanAmount)
  const monthlyEmi = computed(() => quote.value.monthlyEmi)
  const totalInterest = computed(() => quote.value.totalInterest)
  const totalPayment = computed(() => quote.value.totalPayment)

  function applyQuery(query) {
    if (query.price) vehiclePrice.value = Number(query.price) || vehiclePrice.value
    if (query.down) downPayment.value = Number(query.down) || downPayment.value
    if (query.apr) apr.value = Number(query.apr) || apr.value
    if (query.term) termMonths.value = Number(query.term) || termMonths.value
  }

  return {
    TERM_OPTIONS,
    vehiclePrice,
    downPayment,
    apr,
    termMonths,
    loanAmount,
    monthlyEmi,
    totalInterest,
    totalPayment,
    quote,
    applyQuery,
  }
}
