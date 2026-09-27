<script setup>
import { dealer } from '@/data/dealer'
</script>

<template>
  <section id="contact" class="py-5">
    <div class="container">
      <div class="bg-primary text-white rounded-4 p-4 p-md-5">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <h2 class="fw-bold mb-2">Ready for a test drive?</h2>
            <p class="lead mb-0">
              Tell us which vehicle you like and we'll have it washed, charged and waiting.
            </p>
          </div>
          <div class="col-lg-5">
            <div class="d-flex flex-column flex-sm-row justify-content-lg-end gap-2">
              <RouterLink class="btn btn-light btn-lg" :to="{ name: 'test-drive' }">
                <i class="bi bi-calendar-check me-2"></i>Book a test drive
              </RouterLink>
              <a class="btn btn-outline-light btn-lg" :href="dealer.phoneHref">
                <i class="bi bi-telephone me-2"></i>{{ dealer.phone }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
