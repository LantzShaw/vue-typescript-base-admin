<template>
  <div class="right-container">
    <section>
      <CardTitle label="溯源状态统计" />
      <div class="right-container--traceability"> </div>
    </section>
    <section>
      <CardTitle label="事件触发流程统计" />
      <div class="right-container--event-trigger"> </div>
    </section>
    <section>
      <CardTitle label="维护流程统计" />
      <div class="right-container--maintain"> </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import CardTitle from '../../CardTitle.vue';
</script>

<style scoped lang="less">
  .right-container {
    width: 424px;
    height: calc(100% - 102px);
    margin-right: 30px;

    &--traceability {
      height: 280px;
    }

    &--event-trigger {
      height: 280px;
    }

    &--maintain {
      height: 280px;
    }
  }
</style>
