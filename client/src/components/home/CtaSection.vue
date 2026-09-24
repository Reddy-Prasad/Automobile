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
              <a class="btn btn-light btn-lg" :href="dealer.phoneHref">
                <i class="bi bi-telephone me-2"></i>{{ dealer.phone }}
              </a>
              <a class="btn btn-outline-light btn-lg" :href="`mailto:${dealer.email}`">
                <i class="bi bi-envelope me-2"></i>Email us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
