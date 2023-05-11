<template>
  <div class="left-container">
    <section>
      <CardTitle label="气体种类统计" />
      <div class="left-container--category">
        <LeftBoxGasPie />
      </div>
    </section>
    <section>
      <CardTitle label="气体分布统计" />
      <div class="left-container--distribution"> </div>
    </section>
    <section>
      <CardTitle label="生命周期统计" />
      <div class="left-container--lifecycle"> </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import CardTitle from '../../CardTitle.vue';
  import LeftBoxGasPie from './LeftBoxGasPie.vue';
</script>

<style scoped lang="less">
  .left-container {
    width: 424px;
    height: calc(100% - 102px);
    margin-left: 30px;

    &--category {
      height: 280px;
      vertical-align: middle;
    }

    &--distribution {
      height: 280px;
    }

    &--lifecycle {
      height: 280px;
    }
  }
</style>
