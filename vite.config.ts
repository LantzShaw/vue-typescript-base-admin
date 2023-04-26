import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    server: {
      proxy: {
        '/basic-api': {
          target: 'http://localhost:8847',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), '/basic-api'),
          // only https
          // secure: false
        },
        '/upload': {
          target: 'http://localhost:8847/basic-api/biz/common/upload',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
        },
        // '/ureport': {
        //   target: 'http://localhost:8847',
        //   changeOrigin: true,
        //   ws: true,
        //   rewrite: (path) => path.replace(new RegExp(`^/ureport`), '/ureport'),
        // },
        '/ureport': {
          target: 'http://localhost:8847/ureport', //公司内部童鞋使用本地服务后端
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ureport/, ''),
        },
      },
    },
  },
});
