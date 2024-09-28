<template>
  <div class="layout-container">
    <component :is="LayoutComponents[layout]" />
  </div>
</template>

<script>

export default {
  name: "Layouts-index",
  data() {
    return {
      layout: 'defaultLayout',
      LayoutComponents: {
        defaultLayout: () => import('@/layouts/LayoutClassic/index.vue')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.layout {
  min-width: 600px;
}
</style>