<script setup lang="ts">
</script>
<template>
  <main class="bg-white rounded-md shadow-sm">
    <header class="p-4 border-b" v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <article class="p-4">
      <slot></slot>
    </article>
    <footer class="p-4" v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </main>
</template>
