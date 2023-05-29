<template>
  <BMap>
    <Header />
    <main class="main-container">
      <LeftBox />
      <MiddleBox />
      <RightBox />
    </main>
  </BMap>
</template>

<script lang="ts" setup>
  // import AMap from '../AMap.vue';
  import BMap from '../BMap.vue';
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
