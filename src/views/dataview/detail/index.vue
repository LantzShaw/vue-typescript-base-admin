<template>
  <Header />
  <main class="main-container">
    <LeftBox />
    <MiddleBox />
    <RightBox />
  </main>
</template>

<script lang="ts" setup>
  import Header from '../Header.vue';

  import LeftBox from './components/LeftBox.vue';
  import MiddleBox from './components/MiddleBox.vue';
  import RightBox from './components/RightBox.vue';
</script>

<style scoped lang="less">
  .main-container {
    position: absolute;
    display: flex;
    height: 100%;
  }
</style>
