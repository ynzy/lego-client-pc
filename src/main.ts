import { createApp } from "vue";
import App from "./App.vue";
// 引入antd
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// 引入 cropperjs
import "cropperjs/dist/cropper.css";
// 引入 lego-component-ynzy
import legoComponentYnzy from "lego-component-ynzy";
// import "lego-component-ynzy/dist/components"

import router from "./router";
import store from "./store";
const app = createApp(App);
app
  .use(Antd)
  .use(legoComponentYnzy)
  .use(router)
  .use(store);
app.mount("#app");
