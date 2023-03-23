<template>
  <el-container class="advance-query-form">
    <el-aside width="300px">
      <el-card
        class="base-card"
        shadow="never"
        :body-style="{ padding: '0px' }"
        style="border: none"
      >
        <div slot="header" class="base-card-header">
          <span style="font-size: 16px; font-weight: 500; color: #282828">权限模块</span>
          <div class="base-card-operation">
            <el-button type="text" icon="el-icon-circle-plus-outline" />
          </div>
        </div>
        <el-scrollbar class="custom-scroll">
          <el-tree ref="moduleTree" />
        </el-scrollbar>
      </el-card>
    </el-aside>
    <el-main style="margin-left: 15px; background-color: white; padding: 20px">
      <el-form ref="formPerm" label-width="75px" label-position="right">
        <el-form-item label="关联URL" prop="formFilter.url">
          <el-input class="filter-item" placeholder="URL模糊搜索" clearable />
        </el-form-item>
        <el-button slot="operator" type="default" :plain="true">重置</el-button>
        <el-button slot="operator" type="primary" :plain="true">查询</el-button>
        <el-button slot="operator" type="primary"> 新建</el-button>
      </el-form>

      <el-row>
        <el-col :span="24">
          <el-table>
            <el-table-column label="权限名称" prop="permName" width="150px" />
            <el-table-column label="权限模块" prop="moduleIdDictMap.name" width="100px" />
          </el-table>
          <el-col :span="24">
            <el-row type="flex" justify="end" style="margin-top: 10px">
              <el-pagination />
            </el-row>
          </el-col>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  // hooks
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  // 组件
  import { Input, Layout, Card, Tree } from 'ant-design-vue';
  import {
    ElContainer,
    ElAside,
    ElMain,
    ElCard,
    ElScrollbar,
    ElButton,
    ElTree,
    ElForm,
    ElFormItem,
    ElInput,
    ElRow,
    ElCol,
    ElTable,
    ElTableColumn,
    ElPagination,
  } from 'element-plus';
  import { PageWrapper } from '/@/components/Page';

  const ALayout = Layout;

  const ASider = Layout.Sider;
  const AContent = Layout.Content;
  const AFooter = Layout.Footer;
  const ACard = Card;
  const ATree = Tree;

  onMounted(() => {});
</script>
