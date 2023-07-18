<template>
  <div class="table-title-container">
    <div>
      <span class="text">{{ label }}</span>
      <slot></slot>
    </div>
    <div class="action" @click="handleShowMore">更多></div>
  </div>
</template>

<script lang="ts" setup>
  type Props = {
    label?: string;
  };

  const emit = defineEmits(['onShow']);

  withDefaults(defineProps<Props>(), {});

  function handleShowMore() {
    emit('onShow', true);
  }
</script>

<style scoped lang="less">
  .table-title-container {
    width: 100%;
    height: 50px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;

    .text {
      font-size: 22px;
      font-family: PANG_MEN_ZHENG_DAO;
      color: #fff;
      display: inline-block;
      vertical-align: middle;
      text-shadow: 1px 2px 8px rgba(13, 24, 45, 0.26);
      background: linear-gradient(74deg, rgba(139, 199, 255, 0.6) 0%, rgba(255, 255, 255, 1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-right: 10px;

      &::before {
        content: '';
        width: 20px;
        height: 33px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 9px;

        background: url('/@/assets/images/dataview/prefix_icon.png') top left no-repeat;
      }
    }

    .action {
      color: rgba(0, 168, 255, 1);
      font-size: 16px;
      cursor: pointer;
    }
  }
</style>
