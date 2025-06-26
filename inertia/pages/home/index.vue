  <script lang="ts" setup>
  import MainLayout from '~/components/MainLayout.vue'
  import MainHeader from '~/components/MainHeader.vue'
</script>

<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <div style="position: relative; width: 71%; height: 0; padding-top: 40%;
 padding-bottom: 0; margin-top: 1.6em; margin-bottom: 0.9em; margin-left: auto; margin-right: auto; overflow: hidden;
 border-radius: 8px; z-index: 0;">
      <iframe loading="lazy"
        style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
        src="https://www.canva.com/design/DAGfv-zlNvg/cKve1c-7lU6Y0hALa2K1UQ/view?embed"
        >
      </iframe>
    </div>
  </MainLayout>
</template>

