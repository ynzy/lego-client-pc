import { createApp } from "vue";
import App from "./App.vue";
// 引入antd
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import router from "./router";
import store from "./store";
const app = createApp(App);
app
  .use(Antd)
  .use(router)
  .use(store);
app.mount("#app");
