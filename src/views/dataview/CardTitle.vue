<template>
  <div class="title-container">
    <span class="title-container--clip-text">{{ label }}</span>
  </div>
</template>

<script lang="ts" setup>
  type Props = {
    label?: string;
  };

  withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="less">
  .title-container {
    width: 100%;
    height: 42px;
    font-size: 20px;
    padding-left: 49px;

    background: url('/@/assets/images/dataview/card_title.png') top left no-repeat;

    &--clip-text {
      font-family: 'PANG_MEN_ZHENG_DAO';
      color: #f4f9ff;

      text-shadow: 1px 2px 8px rgba(13, 24, 45, 0.26);
      background: linear-gradient(74deg, rgba(139, 199, 255, 1) 0%, rgba(255, 255, 255, 1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
</style>
