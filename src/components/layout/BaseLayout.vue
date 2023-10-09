<script setup>
defineOptions({
  name: 'BaseLayout',
})
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <div class="layout__content">
      <RouterView />
    </div>
    <!-- Footer -->
  </div>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  min-height: 100vh;

  // &__content {
  // }
}
</style>
