<script setup>
defineProps({
  type: { type: String, required: true },
  item: { type: Object, default: null },
})
</script>

<template>
  <div v-if="item" class="cms-preview-frame rounded p-3">
    <p class="small text-uppercase fw-semibold text-body-secondary mb-3">Client preview</p>

    <article v-if="type === 'offers'" class="card border-0 shadow-sm">
      <div class="card-body">
        <span class="badge text-bg-primary mb-2">{{ item.type }}</span>
        <p class="small text-uppercase mb-1">{{ item.vehicle }}</p>
        <h3 class="h5 fw-bold text-primary">{{ item.headline || 'Headline' }}</h3>
        <p class="text-body-secondary mb-0">{{ item.details }}</p>
      </div>
    </article>

    <article v-else-if="type === 'banners'" class="bg-dark text-white rounded p-4">
      <p class="small text-warning text-uppercase mb-1">{{ item.eyebrow }}</p>
      <h3 class="h4">{{ item.title || 'Banner title' }}</h3>
      <p class="text-white-50">{{ item.text }}</p>
      <span class="btn btn-warning btn-sm">{{ item.primaryLabel || 'Learn more' }}</span>
    </article>

    <article v-else-if="type === 'pages'">
      <h3 class="h4">{{ item.title || 'Page title' }}</h3>
      <p class="small text-body-secondary">/{{ item.slug || 'slug' }}</p>
      <p class="mb-0" style="white-space: pre-wrap">{{ item.body }}</p>
    </article>

    <article v-else-if="type === 'homepage'">
      <p class="small text-uppercase text-primary fw-semibold">{{ item.eyebrow }}</p>
      <h3 class="h4">{{ item.headline }}</h3>
      <p class="text-body-secondary mb-0">{{ item.subtitle }}</p>
    </article>

    <article v-else-if="type === 'seo'">
      <p class="small text-success mb-1">autodrive.example</p>
      <p class="h5 text-primary mb-1">{{ item.title || 'Page title' }}</p>
      <p class="small text-body-secondary mb-0">{{ item.description }}</p>
    </article>

    <article v-else-if="type === 'footer'" class="bg-dark text-white-50 rounded p-3">
      <p class="text-white fw-semibold mb-1">AutoDrive</p>
      <p class="small">{{ item.blurb }}</p>
      <p class="small mb-0">{{ item.phone }} · {{ item.email }} · {{ item.hours }}</p>
    </article>

    <article v-else-if="type === 'navigation'">
      <ul class="nav">
        <li v-for="link in item.links || []" :key="link.label" class="nav-item">
          <span class="nav-link px-2">{{ link.label }}</span>
        </li>
      </ul>
    </article>

    <article v-else-if="type === 'media'">
      <img
        v-if="item.url"
        :src="item.url"
        :alt="item.alt"
        class="img-fluid rounded mb-2"
      />
      <p class="small mb-0">{{ item.filename }} — {{ item.alt }}</p>
    </article>
  </div>
</template>
