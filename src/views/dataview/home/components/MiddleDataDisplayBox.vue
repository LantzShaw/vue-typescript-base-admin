<template>
  <div class="display-box-container">
    <span class="display-box-container-text mr-2">{{ label }}: </span>
    <span class="display-box-container-text">{{ digit }}</span>
  </div>
</template>

<script lang="ts" setup>
  type Props = {
    label?: string;
    digit?: string;
  };

  withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="less">
  .display-box-container {
    height: 33px;
    width: 140px;
    line-height: 18px;
    background: url('/@/assets/images/dataview/data_bg.png') left top no-repeat;
    text-align: center;

    &-text {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      // text-shadow: 0px 2px 3px rgba(30, 26, 43, 0.6);
      font-family: Source Han Sans CN;
      background: linear-gradient(180deg, #fff 0%, #a7fff4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
</style>
