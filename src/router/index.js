import router from "./router"
import NProgress from "nprogress"
import 'nprogress/nprogress.css'// progress bar style
import config from "@/settings"
import {getToken} from "@/utils/auth";
import store from "@/store"

const whiteList = ["/login", "/", "/register", "/meetings", "/latest"];

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + " | " + config.title
  }
  NProgress.start();
  const token = getToken();
  if (token && "undefined" !== token) {
    if (to.path === "/login") {
      next({path: "/"});
      NProgress.done()
    } else {
      if (store.getters.avatar.length === 0) {
        store.dispatch("GetInfo").then(() => {
        }).catch(error => {
          console.log(error);
        })
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next("/login");
      NProgress.done()
    }
  }
  
});

router.afterEach(() => {
  NProgress.done() // finish progress bar
});
