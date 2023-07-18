<template>
  <div>
    <Header :is-show-back="true">
      <div class="back-btn" v-auth="'biz:syf:privileges'" @click="navigateHandler">后台子系统</div>
    </Header>
    <main class="main-container">
      <LeftBox />
      <MiddleBox />
      <RightBox />
    </main>
  </div>
</template>

<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';

  import Header from '../Header.vue';

  import LeftBox from './components/LeftBox.vue';
  import MiddleBox from './components/MiddleBox.vue';
  import RightBox from './components/RightBox.vue';

  const go = useGo();

  function navigateHandler() {
    go(`/home/welcome`);
  }
</script>

<style scoped lang="less">
  .main-container {
    position: absolute;
    display: flex;
    height: 100%;
  }

  .back-btn {
    font-size: 16px;
    width: 99px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    color: #fff;
    border: solid 2px transparent;
    border-radius: 19px;
    background-image: linear-gradient(
        rgba(1, 167, 204, 1),
        rgba(3, 52, 111, 1),
        rgba(1, 167, 204, 1)
      ),
      linear-gradient(180deg, #0072ff, #00e4ff);
    background-origin: border-box;
    background-clip: content-box, border-box;
    cursor: pointer;
  }
</style>
