<template>
  <BMap v-if="getOkAuth">
    <Header>
      <div class="back-btn" @click="navigateHandler">后台子系统</div>
    </Header>
    <main class="main-container">
      <LeftBox />
      <MiddleBox />
      <RightBox />
    </main>
  </BMap>
  <div v-else></div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useGo } from '/@/hooks/web/usePage';
  import { usePermission } from '/@/hooks/web/usePermission';

  // import AMap from '../AMap.vue';
  import BMap from '../BMap.vue';
  import Header from '../Header.vue';
  import LeftBox from './components/LeftBox.vue';
  import MiddleBox from './components/MiddleBox.vue';
  import RightBox from './components/RightBox.vue';

  const go = useGo();
  const route = useRoute();
  const router = useRouter();

  const { hasPermission } = usePermission();

  onMounted(() => {
    if (hasPermission('biz:data-view:view')) {
    } else {
      go(`/biz/dataview/detail`);
    }
  });

  const getOkAuth = computed(() => {
    return hasPermission('biz:data-view:view');
  });
  function navigateHandler() {
    go(`/home/welcome`);
  }
</script>

<style scoped lang="less">
  .main-container {
    display: flex;
    position: absolute;
    height: 100%;
  }

  .back-btn {
    width: 99px;
    height: 38px;
    border: solid 2px transparent;
    border-radius: 19px;
    background-clip: content-box, border-box;
    background-image: linear-gradient(
        rgb(1 167 204 / 100%),
        rgb(3 52 111 / 100%),
        rgb(1 167 204 / 100%)
      ),
      linear-gradient(180deg, #0072ff, #00e4ff);
    color: #fff;
    font-size: 16px;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
    background-origin: border-box;
  }
</style>
