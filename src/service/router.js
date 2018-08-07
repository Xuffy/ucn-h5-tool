import Vue from 'vue'
import Vuex from 'vuex';
import Router from 'vue-router'
import Config from 'service/config';
import Layout from 'components/layout/index.vue';
import $i from '../language/index';
import {Notification, Message} from 'element-ui';
import {localStore, sessionStore} from 'service/store';
import Util from 'service/util';

Vue.use(Router);

export const routerMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/home/index',
    hidden: true, // 在侧边栏中不显示该菜单
  },
  {
    path: '/login',
    hidden: true,
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/home',
    component: Layout,
    meta: {name: $i.router.workbench},
    redirect: '/home/index',
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: 'home',
        meta: {
        },
        component: () => import('../views/home/index.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    meta: {name: $i.router.workbench},
    redirect: '/auth/index',
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: 'auth',
        meta: {
        },
        component: () => import('../views/auth/index.vue')
      }
    ]
  },
  {
    path: '/dictionary',
    component: Layout,
    meta: {name: $i.router.workbench},
    redirect: '/dictionary/index',
    noDropdown: true,
    children: [
      {
        path: 'index',
        name: 'dictionary',
        meta: {
        },
        component: () => import('../views/dictionary/index.vue')
      }
    ]
  }

]

let router = new Router({
  routes: routerMap
});

router.beforeResolve((to, from, next) => {
  let ts = localStore.get('token');

  /*if (to.path !== '/login' || from.path === '/login') {
    if (_.isEmpty(ts)) { // 登录验证
      return next({path: '/login'});
    }
  }
*/
  next();
});

export default router
