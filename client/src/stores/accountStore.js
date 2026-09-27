import { defineStore } from 'pinia'
import { failNextRequest } from '@/api/http'
import {
  deleteFinanceApplication,
  listFinanceApplications,
  replaceFinanceApplication,
} from '@/services/financeService'
import { deleteServiceBooking, listServiceBookings } from '@/services/serviceBookingService'
import { deleteTestDrive, listTestDrives, patchTestDrive } from '@/services/testDriveService'
import { deleteTradeIn, listTradeIns } from '@/services/tradeInService'
import { belongsToUser } from '@/utils/account'
import { useAuthStore } from './authStore'

export const useAccountStore = defineStore('account', {
  state: () => ({
    testDrives: [],
    financeApplications: [],
    serviceBookings: [],
    tradeIns: [],
    status: 'initial',
    error: null,
  }),

  getters: {
    mine() {
      const user = useAuthStore().user
      return {
        testDrives: this.testDrives.filter((item) => belongsToUser(item, user)),
        financeApplications: this.financeApplications.filter((item) => belongsToUser(item, user)),
        serviceBookings: this.serviceBookings.filter((item) => belongsToUser(item, user)),
        tradeIns: this.tradeIns.filter((item) => belongsToUser(item, user)),
      }
    },
  },

  actions: {
    async load() {
      this.status = 'loading'
      this.error = null

      try {
        const [drives, finance, service, trade] = await Promise.all([
          listTestDrives(),
          listFinanceApplications(),
          listServiceBookings(),
          listTradeIns(),
        ])
        this.testDrives = drives
        this.financeApplications = finance
        this.serviceBookings = service
        this.tradeIns = trade
        const none = !drives.length && !finance.length && !service.length && !trade.length
        this.status = none ? 'empty' : 'success'
      } catch (error) {
        this.error = error
        this.status = 'error'
        this.testDrives = []
        this.financeApplications = []
        this.serviceBookings = []
        this.tradeIns = []
        throw error
      }
    },

    async confirmDrive(id) {
      await patchTestDrive(id, { status: 'confirmed' })
      return this.load()
    },

    async cancelDrive(id) {
      await deleteTestDrive(id)
      return this.load()
    },

    async updateApplication(application, changes) {
      await replaceFinanceApplication(application.id, { ...application, ...changes })
      return this.load()
    },

    async removeApplication(id) {
      await deleteFinanceApplication(id)
      return this.load()
    },

    async cancelService(id) {
      await deleteServiceBooking(id)
      return this.load()
    },

    async cancelTradeIn(id) {
      await deleteTradeIn(id)
      return this.load()
    },

    simulateError() {
      failNextRequest()
      return this.load()
    },
  },
})
