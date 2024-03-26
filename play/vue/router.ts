import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
        path: "/minimap",
        name: "minimap",
        component: () => import("./components/minimap.vue"),
    },
    {
      path: "/table",
      name: "table",
      component: () => import("./components/table.vue"),
    },
  ],
});

export default router;
