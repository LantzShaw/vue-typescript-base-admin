import { withInstall } from '/@/utils';
import basicUpload from './src/BasicUpload.vue';

export { default as AuthImage } from './src/AuthImage.vue';

export const BasicUpload = withInstall(basicUpload);
