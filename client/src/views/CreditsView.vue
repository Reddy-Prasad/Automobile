<script setup>
import SectionHeading from '@/components/common/SectionHeading.vue'
import { imageCredits } from '@/data/imageCredits'
</script>

<template>
  <section class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Attribution"
        title="Photo credits"
        subtitle="Vehicle photos come from Wikimedia Commons and are used under the licenses listed below. Images were resized; no other changes were made."
      />

      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <div v-for="credit in imageCredits" :key="credit.image" class="col">
          <figure class="card h-100 border-0 shadow-sm mb-0">
            <img
              :src="credit.image"
              :alt="credit.subject"
              class="card-img-top object-fit-cover credit-media bg-body-secondary"
              loading="lazy"
            />
            <figcaption class="card-body small">
              <p class="fw-semibold mb-1">{{ credit.subject }}</p>
              <p class="mb-1 text-body-secondary">Photo by {{ credit.author }}</p>
              <p class="mb-0">
                <a v-if="credit.licenseUrl" :href="credit.licenseUrl" target="_blank" rel="noopener">
                  {{ credit.license }}
                </a>
                <span v-else>{{ credit.license }}</span>
                &middot;
                <a :href="credit.source" target="_blank" rel="noopener">Source</a>
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.credit-media {
  aspect-ratio: 16 / 10;
}
</style>
