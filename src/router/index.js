import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/whm/HomeView";
import PickingView from "@/views/whm/PickingView";
import PackingView from "@/views/whm/PackingView";
import AssociationView from "@/views/whm/AssociationView";
import InventoryView from "@/views/whm/InventoryView";
import AllProductView from "@/views/admin/AllProductView";
import AllOrdersView from "@/views/admin/AllOrdersView";
import ReceptionView from "@/views/admin/ReceptionView";
import LoginView from "@/views/LoginView";

Vue.use(VueRouter);

const routes = [
  // Warehouse manager Views
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/picking",
    name: "picking",
    component: PickingView,
  },
  {
    path: "/packing",
    name: "packing",
    component: PackingView,
  },
  {
    path: "/association",
    name: "association",
    component: AssociationView,
  },
  {
    path: "/inventory",
    name: "inventory",
    component: InventoryView,
  },

  // admin views
  {
    path: "/admin/home",
    name: "admin",
    component: AllProductView,
  },

  {
    path: "/admin/reception",
    name: "admin-ReceptionView",
    component: ReceptionView,
  },

  // All orders
  {
    path: "/admin/all-orders",
    name: "admin-allOrders",
    component: AllOrdersView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.fullPath !== "/login") {
    if (!sessionStorage.getItem("key")) {
      next("/login");
    }
  }
  if (to.fullPath === "/login") {
    if (sessionStorage.getItem("key")) {
      next("/admin/home");
    }
  }

  next();
});

export default router;
