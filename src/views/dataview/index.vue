<template>
  <FullScreenConatiner :width="1920" :height="1080">
    <!-- <router-view /> -->
    <router-view v-slot="{ Component, route }">
      <transition name="fade-right" mode="out-in" appear>
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </FullScreenConatiner>
</template>

<script lang="ts" setup>
  import FullScreenConatiner from './FullScreenConatiner.vue';
</script>

<style lang="less" scoped>
  // 进入后和离开前保持原位
  .fade-right-enter-to,
  .fade-right-leave-from {
    opacity: 1;
    transform: none;
  }

  // 设置进入和离开过程中的动画时长0.5s
  .fade-right-enter-active,
  .fade-right-leave-active {
    transition: all 0.5s;
  }

  // 进入前和离开后为透明，并在右侧20px位置
  .fade-right-enter-from,
  .fade-right-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
</style>
