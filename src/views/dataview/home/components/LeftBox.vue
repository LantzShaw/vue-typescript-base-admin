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
      <div class="left-container--distribution">
        <LeftBoxGasBar />
      </div>
    </section>
    <section>
      <CardTitle label="生命周期统计" />
      <div class="left-container--lifecycle">
        <LifecycleAnnular />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import CardTitle from '../../CardTitle.vue';
  import LifecycleAnnular from '../../LifecycleAnnular.vue';
  import LeftBoxGasBar from './LeftBoxGasBar.vue';
  import LeftBoxGasPie from './LeftBoxGasPie.vue';
</script>

<style scoped lang="less">
  .left-container {
    width: 424px;
    height: calc(1920px - 102px);
    margin-left: 30px;

    &--category {
      height: 280px;
      vertical-align: middle;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    &--distribution {
      height: 280px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    &--lifecycle {
      height: 280px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
  }
</style>
