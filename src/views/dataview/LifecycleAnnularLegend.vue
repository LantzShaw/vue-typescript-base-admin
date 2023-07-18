<template>
  <div class="container">
    <div class="text" :style="{ '--text-color': color }">
      {{ name }}
    </div>
    <div class="dispaly-value"> {{ displayValue }} </div>

    <span style="color: #fff">个</span>
  </div>
</template>

<script lang="ts" setup>
  type Props = {
    name?: string;
    color?: string;
    displayValue?: number;
  };

  withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="less">
  .container {
    width: 130px;
    height: 50px;
    line-height: 50px;
    display: flex;
    border-bottom: 1px dashed #deebff;
    justify-content: space-around;

    .text {
      color: #deebff;
      margin-right: 14px;
    }

    .text::before {
      content: '';
      display: inline-block;
      width: 11px;
      height: 11px;
      border: 2px solid var(--text-color);
      margin-right: 6px;
      border-radius: 2px;
    }

    .dispaly-value {
      color: #41a6fc;
      font-family: 'PANG_MEN_ZHENG_DAO';

      font-size: 20px;
    }
  }
</style>
