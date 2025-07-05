  <script lang="ts" setup>
  import MainLayout from '~/components/MainLayout.vue'
  import MainHeader from '~/components/MainHeader.vue'
  import Showcases from '~/components/Showcases.vue'
</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <Showcases  />
  </MainLayout>
</template>

