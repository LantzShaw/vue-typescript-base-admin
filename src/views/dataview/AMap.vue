<template>
  <div style="position: relative; width: 100%; height: 100%">
    <div id="amap-container"> </div>
    <div style="position: absolute; left: 0; top: 0">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, unref, onMounted, onUnmounted, defineComponent } from 'vue';

  import AMapLoader from '@amap/amap-jsapi-loader';

  import { enterprisePoints } from '/@/api/dataview';

  import point_1 from '/@/assets/images/dataview/point_1.png';
  import point_2 from '/@/assets/images/dataview/point_2.png';
  import point_3 from '/@/assets/images/dataview/point_3.png';

  type Position = {
    dtuipLng: string;
    dtuipLat: string;
    showStatus: string;
    enterpriseName: string;
  };

  // NOTE: declare global
  declare global {
    interface Window {
      _AMapSecurityConfig: any;
    }
  }

  // NOTE: 位置提示以及POI搜索需要设置 - 安全密钥
  window._AMapSecurityConfig = {
    // 安全密钥
    securityJsCode: '6d7f658c2d10e85cb11376fff4919dc4',
  };

  export default defineComponent({
    name: 'AMap',
    setup(props) {
      const map = ref<any>(null);
      const placeList = ref<string[]>([]);
      const marker = ref<any[]>([]);

      const pisitionList = ref<Position[]>([]);

      // 初始化地图
      const initMap = () => {
        AMapLoader.load({
          key: 'ecf60ec8cc4dac4d68be0506499f714c',
          version: '2.0',
        }).then((AMap) => {
          map.value = new AMap.Map('amap-container', {
            viewMode: '3D', // 是否为3D地图模式
            zoom: 15, // 初始化地图级别
            mapStyle: 'amap://styles/39538de9e896cea300f0cc491b5293a4',
            center: [121.064775, 30.605484], //初始化地图中心点位置
          });

          const offlineIcon = new AMap.Icon({
            image: point_1,
          });

          const exceptionIcon = new AMap.Icon({
            // 图标尺寸
            // size: new AMap.Size(25, 34),
            // 图标的取图地址
            image: point_2,
            // 图标所用图片大小
            // imageSize: new AMap.Size(135, 40),
            // 图标取图偏移量
            // imageOffset: new AMap.Pixel(-9, -3),
          });

          const normalIcon = new AMap.Icon({
            image: point_3,
          });

          unref(pisitionList).forEach((item, index) => {
            marker.value.push(
              new AMap.Marker({
                position: [item.dtuipLng, item.dtuipLat],
                zoom: 14,
                map: map.value,
                icon:
                  item.showStatus === '0'
                    ? offlineIcon
                    : item.showStatus === '1'
                    ? exceptionIcon
                    : normalIcon,
              }),
            );

            marker.value[index].on('click', markerClickHandler);

            // marker.value[index].setLabel({
            //   // offset: new AMap.Pixel(20, 20), //设置文本标注偏移量
            //   content: `<div id="activeLabel">${item.enterpriseName}</div>`, //设置文本标注内容
            //   direction: 'right', //设置文本标注方位
            // });
          });

          // map.value.on('click', (e) => {
          //   emit('update:position', [e.lnglat.getLng(), e.lnglat.getLat()]);
          // });

          setMarker();

          // map.value.setZoom(map.value.getZoom());

          // map.value.setFitView();
        });
      };

      const setMarker = () => {
        // marker 标注
        map.value.add(marker.value);
      };

      const markerClickHandler = (value) => {
        console.log(value);

        // let active_label: HTMLElement | null = document.getElementById('activeLabel'); //通过名字获取自定义标签的div对象

        // let active_label_top: HTMLElement | null = active_label?.parentNode; //获取上一级div对象

        // console.log('active_label', active_label, active_label_top);

        // active_label_top?.removeChild(); //删除自定义的标签

        // active_label!.style.visibility = 'hidden'; //将Label所在标签设置为隐藏。
      };

      async function getEnterprisePoints() {
        const response = await enterprisePoints();

        pisitionList.value = response.filter((item) => item.dtuipLat);
      }

      onMounted(async () => {
        await getEnterprisePoints();

        initMap();
      });

      onUnmounted(() => {
        // map.value.remove(marker.value);
        // map.value.destroy();
        // map.value = null;
      });

      return {
        map,
        placeList,
      };
    },
  });
</script>

<style lang="less" scoped>
  #amap-container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
  }

  :deep(.amap-marker-label) {
    padding: 0 !important;
    width: 222px;
    height: 54px;
    margin: 0;
    color: #fff;
    text-align: center;
    line-height: 54px;
    font-size: 18px;
    border: none !important;
    background: transparent url('/@/assets/images/dataview/data_bg_2.png') top left no-repeat;
  }

  // 隐藏logo
  :deep(.amap-logo) {
    display: none !important;
  }

  // 隐藏copyright
  :deep(.amap-copyright) {
    visibility: hidden !important;
  }
</style>
