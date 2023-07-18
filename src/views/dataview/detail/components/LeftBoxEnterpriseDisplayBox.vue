<template>
  <div class="display-box-container" :style="styles">
    <div class="text-bold">{{ personType ?? '--' }}</div>
    <div class="text">{{ userName ?? '--' }}</div>
    <div class="text">{{ phoneNumber ?? '--' }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  type Props = {
    personType: string;
    userName: string;
    phoneNumber: string;
    backgroundImagePath: string;
  };

  const props = withDefaults(defineProps<Props>(), {});

  const styles = computed(() => {
    const url = new URL(props.backgroundImagePath, import.meta.url).href;
    return {
      background: `url("${url}") top left no-repeat`,
    };
  });
</script>

<style scoped lang="less">
  .display-box-container {
    width: 121px;
    height: 115px;
    padding-left: 51px;

    .text-bold {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
      line-height: 35px;
      text-shadow: 0px 0px 11px rgba(0, 255, 248, 0.7);
    }

    .text {
      font-size: 12px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #fff1d9;
      line-height: 14px;
      padding: 2px 0;
    }
  }
</style>
