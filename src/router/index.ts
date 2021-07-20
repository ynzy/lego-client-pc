import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/Index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    component: Index,
    children: [
      {
        path: "",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/Home.vue"),
        meta: { withHeader: true },
      },
      {
        path: "template/:id",
        name: "template",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/TemplateDetail.vue"),
        meta: { withHeader: true },
      },
    ],
  },
  {
    path: "/editor",
    name: "editor",
    component: () =>
      import(/* webpackChunkName: "editor" */ "../views/Editor.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
