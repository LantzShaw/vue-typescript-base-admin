<template>
  <div v-if="loading" class="loading"> 加载中... </div>

  <div v-else>
    <div class="table-header">
      <span v-for="column in columns" :key="column.key">{{ column.title }}</span>
    </div>
    <vue3-seamless-scroll
      :limitScrollNum="5"
      v-if="dataSource && dataSource?.length > 0"
      :hover="true"
      :list="dataSource"
      class="scroll"
    >
      <ul>
        <li
          class="item"
          :style="[index % 2 === 0 ? { ...evenCellStyle } : { ...oddCellStyle }]"
          v-for="(record, index) in dataSource"
          :key="record.key ? record.key : index"
        >
          <div
            class="item-cell"
            v-for="(column, columnIndex) in columns"
            :key="column.key ? column.key : columnIndex"
          >
            <slot
              v-if="$slots[`${column.key}`]"
              :name="column.key"
              v-bind="{ column, record }"
            ></slot>

            <slot v-else>{{ record[`${column.dataIndex}`] }}</slot>
          </div>
        </li>
      </ul>
    </vue3-seamless-scroll>
    <div v-if="dataSource && dataSource?.length === 0" class="table-empty">暂无数据 </div>
  </div>
</template>

<script lang="ts" setup>
  import { CSSProperties } from 'vue';

  import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';

  type TableColumns = {
    title?: string;
    dataIndex?: string;
    key?: string;
  };

  type TableDataSource = {
    [propname: string]: any;
  };

  type Props = {
    columns?: TableColumns[];
    dataSource?: TableDataSource[];
    evenCellStyle?: CSSProperties;
    oddCellStyle?: CSSProperties;
    loading?: boolean;
  };

  withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="less">
  table {
    width: 100%;
    border-collapse: collapse;
  }

  table caption {
    font-size: 2em;
    font-weight: bold;
    margin: 1em 0;
  }

  th,
  td {
    text-align: center;
    padding: 11px 0;
  }

  table thead tr {
    background-color: #19305e;
    color: #fff;
  }

  table tbody tr {
    background-color: #030b21;
    color: #d1fffd;
  }

  table tbody tr:nth-child(odd) {
    background-color: #091b34;
    color: #d1fffd;
  }

  table tbody tr:hover {
    background-color: #0e2d59;
    cursor: pointer;
  }

  .table-empty {
    width: 100%;
    padding: 100px;
    background-color: #091b34;
    text-align: center;
    color: #d1fffd;
  }

  .loading {
    padding: 120px;
    text-align: center;
    background-color: rgba(9, 27, 52);
    color: #d1fffd;
  }

  .scroll {
    height: 230px;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  .scroll .item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #d1fffd;
    padding: 11px 0;
  }
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #19305e;
    color: #fff;
    padding: 11px 0 11px 4%;
  }

  .item-cell {
    width: 50%;
  }
</style>
