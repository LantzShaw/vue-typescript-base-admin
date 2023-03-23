<template>
  <div id="amap-search-container">
    <input id="amap-search-field" @change="changeHandler" />
  </div>
</template>

<script lang="ts">
  import { ref, unref, watch, onUpdated, onMounted, onUnmounted, defineComponent } from 'vue';

  import AMapLoader from '@amap/amap-jsapi-loader';

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
    name: 'AMapSearch',
    props: {
      position: {
        type: Array,
        default: () => ['0', '0'],
      },
    },
    emits: ['update:position'],
    setup(props, { emit }) {
      const map = ref<any>(null);
      const placeSearch = ref<any>({});
      const autocomplete = ref<any>({});
      const placeList = ref<string[]>([]);
      const currentPlace = ref<any>(props.position);
      const marker = ref<any>(null);

      // 初始化地图
      const initMap = () => {
        AMapLoader.load({
          key: 'ecf60ec8cc4dac4d68be0506499f714c',
          version: '2.0',
          plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch'],
        }).then((AMap) => {
          map.value = new AMap.Map('amap-search-container', {
            viewMode: '3D', // 是否为3D地图模式
            zoom: 8, // 初始化地图级别
            // center: [], //初始化地图中心点位置
          });

          console.log('marker', currentPlace.value);

          marker.value = new AMap.Marker({
            position: currentPlace.value,
            zoom: 6,
            map: map.value,
          });

          // 输入提示
          autocomplete.value = new AMap.Autocomplete({
            city: '全国',
            input: 'amap-search-field', // 输入框DOM id
          });

          // POI搜索
          placeSearch.value = new AMap.PlaceSearch({
            city: '全国',
            map: map.value,
          });

          map.value.on('click', (e) => {
            emit('update:position', [e.lnglat.getLng(), e.lnglat.getLat()]);
          });

          // autocomplete.value.on('select', (e) => {
          //   // TODO: 针对选中的poi实现自己的功能
          //   placeSearch.value.search(e.poi.name);
          // });

          setMarker();

          map.value.setZoom(map.value.getZoom());

          map.value.setFitView();
        });
      };

      const setMarker = () => {
        // marker 标注
        map.value.add(marker.value);

        console.log('marker', unref(marker));
      };

      // debounce
      const changeHandler = (e) => {
        console.log(e);
        // autocomplete.value.search(currentPlace.value, (_, result) => {
        //   console.log('step1', result);
        // });
      };

      // NOTE: props更新重新加载地图 - 这步很关键
      // 如果不在这更新，当我们访问别的页面之后
      // 再返回该页面，再点击编辑的时候，获取的是第一次传过来的props，即父组件的初始值
      // 使用watch监听也没用，watcheEffect 的 flust: post也没用
      onUpdated(() => {
        console.log('map', map);

        // if (props.position[0] !== '1') {
        //   console.log('updat');
        // }
        // initMap();

        // console.log('error2');
      });

      watch(
        () => props.position,
        (newValue) => {
          console.log('newValue', newValue);
          initMap();
          // setMarker();

          currentPlace.value = newValue;
        },
        {
          deep: true,
        },
      );

      onMounted(() => {
        console.log('onMounted');

        initMap();
      });

      onUnmounted(() => {
        map.value.remove(marker.value);

        map.value.destroy();

        map.value = null;
      });

      return {
        map,
        placeList,
        currentPlace,

        changeHandler,
      };
    },
  });
</script>

<style lang="less" scoped>
  #amap-search-container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 200px;
    position: relative;
    cursor: pointer;

    #amap-search-field {
      outline: none;
      border: 1px solid #777;
      padding: 2px 4px;
      z-index: 99999;
      width: 30%;
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(255, 255, 255, 0.8);
    }
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
