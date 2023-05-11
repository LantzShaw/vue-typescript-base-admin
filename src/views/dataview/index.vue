<template>
  <FullScreenConatiner :width="1920" :height="1080">
    <router-view />
  </FullScreenConatiner>
</template>

<script lang="ts" setup>
  import FullScreenConatiner from './FullScreenConatiner.vue';
</script>

<style lang="less" scoped></style>
