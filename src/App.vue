<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'App',
})

/**
 * 共用工具
 */
const route = useRoute()

/**
 * dynamic layout
 */
const layout = computed(() => route.meta.layout)
</script>

<template>
  <component :is="layout"></component>
</template>

<style lang="scss" scoped></style>
