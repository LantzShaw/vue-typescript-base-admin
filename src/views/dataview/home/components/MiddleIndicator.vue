<template>
  <div class="indicator-box">
    <div class="indicator-box-text" :style="{ '--background-color': color }">
      <span class="pl-12px">{{ label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  type Props = {
    label?: string;
    color?: string;
  };

  withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="less">
  .indicator-box {
    display: flex;
    width: 100%;
    height: 30px;
    font-size: 17px;
    font-family: Source Han Sans CN;
    color: #ffffff;
    margin-top: 24px;
    margin-left: 55px;

    &-text {
      &::before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 10px;
        border-radius: 2px;
        background-color: var(--background-color);
        vertical-align: middle;
        box-sizing: border-box;
      }
    }
  }
</style>
