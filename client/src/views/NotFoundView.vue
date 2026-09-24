<template>
  <section class="container py-5 text-center">
    <h1 class="display-1 fw-bold text-body-secondary">404</h1>
    <p class="lead">We couldn't find that page.</p>
    <RouterLink class="btn btn-primary" :to="{ name: 'home' }">
      <i class="bi bi-arrow-left me-2"></i>Back to home
    </RouterLink>
  </section>
</template>
