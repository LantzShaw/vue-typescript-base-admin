<template>
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
            // title: '', // 信息窗口标题
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

          map.addOverlay(marker);
        });

        map.centerAndZoom(point, 16);
        map.enableScrollWheelZoom(true);

        // NOTE: 设置地图样式
        map.setMapStyleV2({ styleJson: styleJson });
      }

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
    border-bottom: 1px solid rgb(191, 191, 192);
    display: none;
  }
  /* 消息内容 */
  :deep(.BMap_bubble_content) {
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
