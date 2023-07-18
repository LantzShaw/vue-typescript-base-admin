# Record

### Note

**1. `.vue` 页面只有一个根节点，因为外层有`Transition` 包裹了**

```vue
<script setup lang="ts">
  import backgroundImagePath from '/@/assets/background/logo.png';

  const styles = computed(() => {
    // NOTE: vue3 vite 无法使用require
    // 参考文章: https://juejin.cn/post/7125274210120761352

    const url = new URL(backgroundImagePath, import.meta.url /* 固定写法 */).href;
    return {
      background: `url("${url}") top left no-repeat`,
    };
  });
</script>
```

**调用子组件数据和方法时**

```ts
const foo = ref<InstanceType<typeof Foo> | null>(null);
const foo = ref<InstanceType<typeof Foo>[]>([]);
```

**.ts 文件中无法`console.log()`打印信息** 配置`internal/src/config/common.ts`

```ts
// internal/src/config/common.ts文件
const commonConfig: UserConfig = {
  esbuild: {
    // drop: ['console', 'debugger'], // NOTE: 注释该部分内容即可
  },
};
```

**百度地图**

```vue
<template>
  <!-- <div ref="wrapRef" :style="{ height, width }"></div> -->

  <div style="position: relative; width: 100%; height: 100%">
    <div ref="wrapRef" :style="{ height, width }"> </div>
    <div style="position: absolute; left: 0; top: 0">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, unref, onMounted } from 'vue';

  import { useScript } from '/@/hooks/web/useScript';
  import { enterprisePoints } from '/@/api/dataview';

  import styleJson from './styleJson';

  import point_1 from '/@/assets/images/dataview/point_1.png';
  import point_2 from '/@/assets/images/dataview/point_2.png';
  import point_3 from '/@/assets/images/dataview/point_3.png';

  type Position = {
    dtuipLng: string;
    dtuipLat: string;
    showStatus: string;
    enterpriseName: string;
  };

  const BAI_DU_MAP_URL =
    'https://api.map.baidu.com/getscript?v=3.0&ak=2OSLkvG4yhhnAP96WvMSyw0b4c2x6AG4&services=&t=20210201100830&s=1';
  export default defineComponent({
    name: 'BMap',
    props: {
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '100%',
      },
    },
    setup() {
      const wrapRef = ref<HTMLDivElement | null>(null);
      const { toPromise } = useScript({ src: BAI_DU_MAP_URL });
      const pisitionList = ref<Position[]>([]);

      async function initMap() {
        await toPromise();
        await nextTick();
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const BMap = (window as any).BMap;
        const map = new BMap.Map(wrapEl);
        const point = new BMap.Point(121.061775, 30.619484);

        const offlineIcon = new BMap.Icon(point_1, new BMap.Size(60, 67));

        const exceptionIcon = new BMap.Icon(point_2, new BMap.Size(60, 67));

        const normalIcon = new BMap.Icon(point_3, new BMap.Size(60, 67));

        unref(pisitionList).forEach((item, index) => {
          let point = new BMap.Point(item.dtuipLng, item.dtuipLat);

          const marker = new BMap.Marker(point, {
            title: item.enterpriseName,
            icon:
              item.showStatus === '0'
                ? offlineIcon
                : item.showStatus === '1'
                ? exceptionIcon
                : normalIcon,
          });

          const opts = {
            width: 120, // 信息窗口宽度
            height: 30, // 信息窗口高度
            // title: 'Hello', // 信息窗口标题
          };

          const infoWindow = new BMap.InfoWindow(
            `<div class="info-window" id="markerBtn">${item.enterpriseName}</div>`,
            opts,
          );

          if (!infoWindow.isOpen()) {
            infoWindow.addEventListener('open', () => {
              (document.getElementById('markerBtn') as HTMLElement).onclick = (e) => {
                alert(`门店编号：${item.enterpriseName}`);
              };
            });
          }

          marker.addEventListener('click', () => {
            map.openInfoWindow(infoWindow, point);
          });

          // marker.addEventListener('mouseout', () => {
          //   map.closeInfoWindow(infoWindow, point);
          // });

          // let lable = new BMap.Label(item.enterpriseName, point);

          // map.openInfoWindow(infoWindow, map.getCenter());

          // marker.setLabel(lable);

          map.addOverlay(marker);
        });

        map.centerAndZoom(point, 16);
        map.enableScrollWheelZoom(true);

        // NOTE: 设置地图样式
        map.setMapStyleV2({ styleJson: styleJson });
      }

      // 打开信息窗口
      // function openInfo(content, e) {
      // 	var p = e.target;
      // 	var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      // 	var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
      // 	map.openInfoWindow(infoWindow, point); //开启信息窗口
      //           // 判断窗口的打开状态
      // 	if (!infoWindow.isOpen()) {
      //               // 如果没有打开，则监听打开事件，获取按钮，添加事件
      // 		infoWindow.addEventListener("open", function () {
      // 			document.getElementById("markerbtn").onclick = function (e) {
      // 				alert("门店编号："+e.target.dataset.sid);
      // 			}
      // 		})
      // 	} else {//如果已经打开，直接获取按钮，添加事件
      // 		document.getElementById("markerbtn").onclick = function (e) {
      // 			alert("门店编号：" + e.target.dataset.sid);
      // 		}
      // 	}

      async function getEnterprisePoints() {
        const response = await enterprisePoints();

        pisitionList.value = response.filter((item) => item.dtuipLat);
      }

      onMounted(async () => {
        await getEnterprisePoints();
        initMap();
      });

      return { wrapRef };
    },
  });
</script>

<style lang="less" scoped>
  /* 去掉百度地图logo */
  :deep(.anchorBL) {
    display: none !important;
  }

  :deep(.info-window) {
    // padding: 0 !important;
    width: 280px;
    height: 54px;
    margin: 0;
    color: #fff;
    text-align: left;
    line-height: 54px;
    font-size: 14px;
    padding-left: 10px;
    box-sizing: border-box;
    border: none !important;
    background: transparent url('/@/assets/images/dataview/data_bg_2.png') top left no-repeat;
    cursor: pointer;
  }

  :deep(.BMap_bubble_title) {
    color: white;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    padding-left: 10px;
    // padding-top: 5px;
    border-bottom: 1px solid rgb(191, 191, 192);
    display: none;
    // background-color: #79ccf3;
  }
  /* 消息内容 */
  :deep(.BMap_bubble_content) {
    // background-color: white;
    // background: transparent url('/@/assets/images/dataview/data_bg_2.png') top left no-repeat;

    padding-left: 0;
    padding-top: 0px;
    padding-bottom: 0px;
  }
  /* 内容 */
  :deep(.BMap_pop) div:nth-child(9) {
    top: 0px !important;
    border-radius: 7px;
  }
  /* 左上角删除按键 */
  :deep(.BMap_pop) img {
    // top: 45px !important;
    // left: 720px !important;
    display: none !important;
  }
  :deep(.BMap_top) {
    display: none;
  }
  :deep(.BMap_top) div {
    background-color: white;
  }
  ::v-deep .BMap_bottom {
    display: none;
  }
  :deep(.BMap_center) {
    display: none;
  }
  /* 隐藏边角 */
  :deep(.BMap_pop) div:nth-child(1) div {
    display: none;
  }
  :deep(.BMap_pop div:nth-child(3)) {
    display: none;
  }
  :deep(.BMap_pop div:nth-child(5)) {
    display: none;
  }
  :deep(.BMap_pop) div:nth-child(7) {
    display: none;
  }
</style>
```

### Basic Usage

```js
const url = new URL(point_1, import.meta.url).href;
```

TODO: 表格 afterFetch 调用 setRowSelected() 表格数据加载不出来

**1. BasicForm 使用插槽**

`.data.ts`

```ts
{
    label: t('所属区域'),
    field: 'regionId',
    required: true,
    component: 'ApiSelect',
    // componentProps: {
    //   options: regionOptions,
    // },
    // component: 'Select',
    // colSlot: 'regionId',
    slot: 'regionId',
  },
```

`.vue`

```vue
<template>
  <BasicForm autoFocusFirstItem @register="registerForm">
    <template #organizationId>
      <a-form-item
        :wrapper-col="{ span: 24 }"
        :label-col="{ lg: 5, md: 24 }"
        name="organizationId"
        label="使用单位"
      >
        <a-select
          disabled
          placeholder="请选择使用单位"
          v-model:value="formState.organizationId"
          @change="handleEnterpriseChange"
          :options="enterpriseOptions"
        />
      </a-form-item>
    </template>

    <template #regionId="{ model, field }">
      <a-select
        placeholder="请选择所属区域"
        :loading="isRegionSelectLoading"
        :disabled="isRegionSelectLoading"
        v-model:value="model[field]"
        :options="regionOptions"
      />
    </template>

    <template #regionId>
      <a-form-item
        :wrapper-col="{ span: 24 }"
        :label-col="{ lg: 5, md: 24 }"
        name="organizationId"
        label="所属区域"
      >
        <a-select
          placeholder="请选择所属区域"
          :loading="isRegionSelectLoading"
          :disabled="isRegionSelectLoading"
          v-model:value="formState.regionId"
          :options="regionOptions"
        />
      </a-form-item>
    </template>
  </BasicForm>
</template>
```

`查询表单字段添加插槽，使用#form-xxx`, xxx 表示 field 字段，例如: regionId

```vue
<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #headerTop>
      <a-alert type="info" show-icon>
        <template #message>
          <template v-if="checkedKeys.length > 0">
            <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
            <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
          </template>
          <template v-else>
            <span>未选中任何项目</span>
          </template>
        </template>
      </a-alert>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="getFormValues">获取表单数据</a-button>
    </template>
  </BasicTable>
</template>
```

**2. dict-label 组件需要设置如下样式**

```vue
<style lang="less" scoped>
  .dict-label {
    :deep(.ant-tag) {
      margin: 4px;
    }
  }
</style>
```

**3. 表单联动**

```ts
{
    label: t('使用单位'),
    field: 'organizationId',
    component: 'Select',
    componentProps: ({ formModel, formActionType }) => {
      console.log('---------enterpriseOptions--------', enterpriseOptions);
      // const provincesOptions = [
      //   {
      //     id: 'guangdong',
      //     label: '广东省',
      //     value: '1',
      //     key: '1',
      //   },
      //   {
      //     id: 'jiangsu',
      //     label: '江苏省',
      //     value: '2',
      //     key: '2',
      //   },
      // ];

      return {
        options: enterpriseOptions.value,
        placeholder: '省份与城市联动',
        onChange: (e: any) => {
          console.log('e', e);
          // let citiesOptions =
          //   e == 1
          //     ? citiesOptionsData[provincesOptions[0].id]
          //     : citiesOptionsData[provincesOptions[1].id];
          // // console.log(citiesOptions)
          // if (e === undefined) {
          //   citiesOptions = [];
          // }
          // formModel.city = undefined; //  reset city value
          // const { updateSchema } = formActionType;
          // updateSchema({
          //   field: 'city',
          //   componentProps: {
          //     options: citiesOptions,
          //   },
          // });
        },
      };
    },
  },
```

**4. 重置查询表单字段**

```ts
// clearSelectedRowKeys 设置
// setSelectedRowKeys () 参数不是Ref()

const [
  registerTable,
  { getForm, setColumns, setProps, reload, clearSelectedRowKeys, setSelectedRowKeys },
] = useTable({});

getForm().resetFields();
console.log('getForm', getForm(), getForm().getFieldsValue());
```

**5. 查询表单 时间区间查询**

```ts
/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 8, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('操作时间'),
      field: '[startDate, endDate]',
      component: 'RangePicker',
      componentProps: {
        style: { width: '100%' },
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        placeholder: ['开始时间', '结束时间'],
        getPopupContainer: () => document.body, // popup 撑开高度
      },
    },
  ],
};
```

### Code

```vue
<template>
  <a-tab-pane key="7" tab="形成报告">
    <a-row>
      <a-col :span="24">
        <div class="ml-2 mb-2 text-md text-black font-bold">形成报告</div>
        <a-form-item label="说明内容" name="stepEightRemark">
          <a-textarea
            :readonly="isReadOnly(record.stepEightStatus)"
            :rows="4"
            v-model:value="formState.stepEightRemark"
            placeholder="请填写形成报告说明内容..."
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="附件" name="username">
          <BasicUpload
            :maxSize="20"
            :maxNumber="10"
            :showPreviewNumber="false"
            :emptyHidePreview="true"
            :multiple="false"
            :disabled="isReadOnly(record.stepEightStatus)"
            @change="handleUploadChange('850', $event)"
            :api="uploadApi"
            :value="fileList.fileEight"
          />
        </a-form-item>
      </a-col>
      <a-col span="24">
        <StepAction
          @onSubmit="onSubmitHandler"
          @onReject="onRejectHandler"
          @onConfirm="onConfirmHandler"
          :status="['800', '850', '900']"
          name="形成报告"
          :current-step="record.stepEightStatus"
          :commit-id="record.stepEightEnterpriseId"
        />
      </a-col>
    </a-row>
  </a-tab-pane>
</template>
```

```ts
5.4.2
5.3.2

import { ref, unref } from 'vue';
// hooks
import { useI18n } from '/@/hooks/web/useI18n';

// 公共组件
import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form';

// 接口
import { optionsListApi } from '/@/api/sys/dict';

export const isUpdate = ref(true);
export const idRef = ref('');
export const record = ref<Recordable>({});

export const onlineStatusOptions = ref<any[]>([]);
export const deleteStatusOptions = ref<any[]>([]);
export const alarmStatusOptions = ref<any[]>([]);
export const tfOptions = ref<any[]>([]);
export const grantTypesOptions = ref<any[]>([]);
export const scopeOptions = ref<any[]>([]);

const { t } = useI18n();

/**
 *  查询表单字段
 */
export const searchForm: FormProps = {
  baseColProps: { lg: 6, md: 8 },
  labelWidth: 90,
  schemas: [
    {
      label: t('设备名称'),
      field: 'deviceName',
      component: 'Input',
    },
    {
      label: t('设备编号'),
      field: 'deviceNo',
      component: 'Input',
    },
    {
      label: t('是否报警'),
      field: 'dtuipIsAlarms',
      component: 'Select',
      componentProps: {
        options: alarmStatusOptions,
        allowClear: true,
      },
    },
    {
      label: t('是否删除'),
      field: 'dtuipIsDelete',
      component: 'Select',
      componentProps: {
        options: deleteStatusOptions,
        allowClear: true,
      },
    },
    {
      label: t('是否在线'),
      field: 'dtuipIsLine',
      component: 'Select',
      componentProps: {
        options: onlineStatusOptions,
        allowClear: true,
      },
    },
  ],
};

const isShowAuthenticationSigningAlgorithm = (clientAuthenticationMethods: string[]) => {
  if (Array.isArray(clientAuthenticationMethods)) {
    return (
      clientAuthenticationMethods.includes('private_key_jwt') ||
      clientAuthenticationMethods.includes('client_secret_jwt')
    );
  }
  return false;
};

/**
 * 表格字段
 */
export const tableColumns: BasicColumn[] = [
  {
    title: t('设备名称'),
    dataIndex: 'deviceName',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: t('设备编号'),
    dataIndex: 'deviceNo',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: t('设备平台添加时间'),
    dataIndex: 'dtuipCreateDate',
    width: 150,
    align: 'center',
    ellipsis: true,
    sorter: true,
  },
  {
    title: t('是否报警'),
    dataIndex: 'dtuipIsAlarms',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否删除'),
    dataIndex: 'dtuipIsDelete',
    width: 90,
    align: 'center',
  },
  {
    title: t('是否在线'),
    dataIndex: 'dtuipIsLine',
    width: 90,
    align: 'center',
  },
];

/**
 * 表单字段
 */
export const inputFormSchemas: FormSchema[] = [
  {
    label: t('设备名称'),
    field: 'deviceName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('应用简称(可选)'),
    field: 'abbreviation',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('应用图标(可选)'),
    field: 'logo',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },
  {
    label: t('应用主页(可选)'),
    field: 'homepage',
    component: 'Input',
    componentProps: {
      maxlength: 100,
    },
  },

  {
    label: t('应用类型'),
    field: 'applicationType',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'application_type',
      },
    },
  },
  {
    label: t('令牌时效'),
    field: 'accessTokenValidity',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
      placeholder: '单位秒',
    },
    required: true,
  },
  {
    label: t('刷新时效'),
    field: 'refreshTokenValidity',
    component: 'InputNumber',
    componentProps: {
      maxlength: 10,
      placeholder: '单位秒',
    },
    required: true,
  },
  {
    label: t('客户端密钥过期时间'),
    field: 'clientSecretExpiresAt',
    component: 'DatePicker',
    componentProps: {
      style: { width: '100%' },
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    required: true,
  },
  {
    label: '客户端密钥集URL',
    field: 'jwkSetUrl',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
  {
    label: t('是否需要 Proof Key'),
    field: 'requireProofKey',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('是否需要认证确认'),
    field: 'requireAuthorizationConsent',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('是否允许重用 Refresh Token'),
    field: 'reuseRefreshTokens',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'tf',
      },
    },
  },
  {
    label: t('认证模式'),
    field: 'authorizationGrantTypes',
    component: 'CheckboxGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '回调地址(可多个逗号分隔)',
    field: 'redirectUris',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
    dynamicRules: ({ values }) => {
      if (Array.isArray(values.authorizationGrantTypes)) {
        if (values.authorizationGrantTypes.includes('authorization_code')) {
          return [{ required: true, message: '回调地址必填' }];
        }
      }

      return [];
    },
  },
  {
    label: t('客户端验证模式'),
    field: 'clientAuthenticationMethods',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'authentication_method',
      },
      mode: 'multiple',
    },
  },
  {
    label: t('令牌端点认证签名算法'),
    field: 'authenticationSigningAlgorithm',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'signature',
      },
    },
    ifShow: ({ values }) =>
      isShowAuthenticationSigningAlgorithm(values.clientAuthenticationMethods),
  },
  {
    label: t('OIDC端点认证签名算法'),
    field: 'idTokenSignatureAlgorithm',
    component: 'ApiSelect',
    componentProps: {
      api: optionsListApi,
      params: {
        dictCode: 'signature',
      },
    },
  },
  {
    label: t('Client Id'),
    field: 'clientId',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
    ifShow: ({}) => unref(isUpdate),
  },
  {
    label: t('Client Secret'),
    field: 'clientSecret',
    component: 'Input',
    componentProps: {
      readonly: true,
    },
    ifShow: ({}) => unref(isUpdate),
  },
  {
    label: t('应用范围'),
    field: 'scopes',
    component: 'CheckboxGroup',
    componentProps: {
      options: [],
    },
  },
];
```

### 联动

```js
 {
    label: t('使用单位'),
    field: 'organizationId',
    component: 'Select',
    componentProps: ({ formModel, formActionType }) => {
      console.log('---------enterpriseOptions--------', enterpriseOptions);
      // const provincesOptions = [
      //   {
      //     id: 'guangdong',
      //     label: '广东省',
      //     value: '1',
      //     key: '1',
      //   },
      //   {
      //     id: 'jiangsu',
      //     label: '江苏省',
      //     value: '2',
      //     key: '2',
      //   },
      // ];

      return {
        options: enterpriseOptions.value,
        placeholder: '省份与城市联动',
        onChange: (e: any) => {
          console.log('e', e);
          // let citiesOptions =
          //   e == 1
          //     ? citiesOptionsData[provincesOptions[0].id]
          //     : citiesOptionsData[provincesOptions[1].id];
          // // console.log(citiesOptions)
          // if (e === undefined) {
          //   citiesOptions = [];
          // }
          // formModel.city = undefined; //  reset city value
          // const { updateSchema } = formActionType;
          // updateSchema({
          //   field: 'city',
          //   componentProps: {
          //     options: citiesOptions,
          //   },
          // });
        },
      };
    },
  },
```

`FullScreenConatiner`

```vue
<template>
  <div id="full-screen-container" ref="fullScreenContainerRef">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, nextTick, onUnmounted } from 'vue';
  import { ref } from 'vue';

  type Option = {
    width: number;
    height: number;
  };

  type Props = {
    options: Option;
  };

  const props = withDefaults(defineProps<Props>(), {});

  const width = ref<number>(0); // 大屏真实宽度
  const height = ref<number>(0); // 大屏真实高度
  const originalWidth = ref<number>(0); // 窗口原始宽度
  const originalHeight = ref<number>(0); // 窗口原始高度
  const fullScreenContainerRef = ref<HTMLDivElement | null>(null);

  // 获取相关尺寸数据
  function initSize() {
    return new Promise((resolve) => {
      // 使用 nextTick 确保容器中的内容渲染完成
      nextTick(() => {
        // 获取大屏真实尺寸
        if (props.options.width && props.options.height) {
          width.value = props.options.width;
          height.value = props.options.height;
        } else {
          // 若未传递大屏真实尺寸，则获取容器被内容撑满后的尺寸 作为大屏真实尺寸
          width.value = fullScreenContainerRef.value?.clientWidth as number;
          height.value = fullScreenContainerRef.value?.clientHeight as number;
        }

        // 获取窗口原始尺寸
        if (!originalWidth || !originalHeight) {
          originalWidth.value = window.screen.width;
          originalHeight.value = window.screen.height;
        }
      });

      resolve(null);
    });
  }

  // 设置容器尺寸，让容器尺寸与内容尺寸一致
  function updateSize() {
    if (width.value && height.value) {
      fullScreenContainerRef.value!.style.width = `${width.value}px`;
      fullScreenContainerRef.value!.style.height = `${height.value}px`;
    }
  }

  // 设置容器缩放比例，实现内容一屏完整显示
  function updateScale() {
    // 屏幕视口存在认为缩放，拖动，导致真实视口发生变化，这里获取真实的视口尺寸
    const currentWidth = document.body.clientWidth;
    const currentHeight = document.body.clientHeight;
    // 获取大屏最终宽高， 若未获得大屏幕尺寸，则将屏幕视口原始尺寸作为大屏最终宽高
    const realWidth = width.value || originalWidth.value;
    const realHeight = height.value || originalHeight.value;
    // 计算宽高比
    const widthScale = currentWidth / realWidth;
    const heightScale = currentHeight / realHeight;

    fullScreenContainerRef.value!.style.transform = `scale(${widthScale}, ${heightScale})`;
  }

  // 监听 resize 事件， 动态更新容器缩放比
  async function onResize() {
    await initSize();

    updateScale();
  }

  onMounted(async () => {
    // 获取相关尺寸数据
    await initSize();

    // 设置容器尺寸，让容器尺寸与内容尺寸一致
    updateSize();
    // 设置容器缩放比例，实现内容一屏完整显示
    updateScale();
    // 监听 resize事件，实现页面动态适配
    window.addEventListener('resize', onResize);
  });

  onUnmounted(() => {
    // 页面销毁前 移除 resize 事件监听
    window.removeEventListener('resize', onResize);
  });
</script>

<style lang="less">
  #full-screen-container {
    position: fixed;
    top: 0;
    overflow: hidden;
    transform-origin: left top;
    z-index: 9999;
  }
</style>
```

### Question
