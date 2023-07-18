<template>
  <div v-bind="$attrs" style="position: relative; width: 100%; height: 100%">
    <div ref="wrapRef" :style="{ height, width }"> </div>
    <div style="position: absolute; top: 0; left: 0">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref, unref } from 'vue';

  import { enterprisePoints } from '/@/api/dataview';
import { useScript } from '/@/hooks/web/useScript';

  import { useGo } from '/@/hooks/web/usePage';

  import styleJson from './styleJson';

  import point_1 from '/@/assets/images/dataview/point_1.png';
import point_2 from '/@/assets/images/dataview/point_2.png';
import point_3 from '/@/assets/images/dataview/point_3.png';

  type Position = {
    id: string;
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

      const go = useGo();

      async function initMap() {
        await toPromise();
        await nextTick();
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const BMap = (window as any).BMap;
        const map = new BMap.Map(wrapEl);
        const point = new BMap.Point(121.061775, 30.619484);

        map.getContainer().style.backgroundColor = '#091220ff';

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
                go(`/biz/dataview/detail?id=${item.id}`);
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
        try {
          const response = await enterprisePoints();

          if (response) {
            pisitionList.value = response.filter((item) => item.dtuipLat);
          }
        } catch (error) {
          console.log(error);
        } finally {
        }
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
    box-sizing: border-box;
    width: 280px;
    height: 54px;
    margin: 0;
    padding-left: 10px;
    border: none !important;
    background: transparent url('/@/assets/images/dataview/data_bg_2.png') top left no-repeat;
    color: #fff;
    font-size: 14px;
    line-height: 54px;
    text-align: left;
    cursor: pointer;
  }

  :deep(.BMap_bubble_title) {
    display: none;
    padding-left: 10px;
    border-bottom: 1px solid rgb(191 191 192);
    color: white;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }

  /* 消息内容 */
  :deep(.BMap_bubble_content) {
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
  }

  /* 内容 */
  :deep(.BMap_pop) div:nth-child(9) {
    top: 0 !important;
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
