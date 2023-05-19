<template>
  <table>
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">{{ column.title }}</th>
      </tr>
    </thead>
    <tbody v-if="dataSource && dataSource?.length > 0">
      <tr
        :style="[index % 2 === 0 ? { ...evenCellStyle } : { ...oddCellStyle }]"
        v-for="(record, index) in dataSource"
        :key="record.key ? record.key : index"
      >
        <td v-for="(column, columnIndex) in columns" :key="column.key ? column.key : columnIndex">
          <!-- TODO: 待处理 -->
          <!-- <template v-if="$slots.bodyCell && column.key">
            <slot v-if="$slots.bodyCell" name="bodyCell" v-bind="{ column, record }" />

            <slot>{{ record[`${column.dataIndex}`] }}</slot>
          </template> -->

          <slot v-if="$slots[`${column.key}`]" :name="column.key" v-bind="{ column, record }" />
          <slot v-else>{{ record[`${column.dataIndex}`] }}</slot>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="dataSource && dataSource?.length === 0" class="table-empty">暂无数据 </div>
</template>

<script lang="ts" setup>
  import { CSSProperties } from 'vue';

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
    /* border: 1px solid #999; */
    text-align: center;
    padding: 20px 0;
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
    padding: 50px;
    background-color: #091b34;
    text-align: center;
    color: #d1fffd;
  }
</style>
