import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  // 绘图标注页面
  {
    path: '/',
    component: Layout,
    redirect: '/draw-ailabel',
    children: [
      {
        path: 'draw-ailabel',
        component: () => import('@/views/drawborad/draw-ailabel/draw-ailabel'),
        name: 'DrawAILabel',
        meta: { title: '图像标注', icon: 'el-icon-picture', affix: true }
      }
    ]
  },
  {
    path: '/area',
    component: Layout,
    children: [
      {
        path: 'area',
        component: () => import('@/views/drawborad/area/area'),
        name: 'Area',
        meta: { title: '区域标注', icon: 'area', affix: true }
      }
    ]
  },
  {
    path: '/lane',
    component: Layout,
    children: [
      {
        path: 'lane',
        component: () => import('@/views/drawborad/lane/lane'),
        name: 'Lane',
        meta: { title: '车道标注', icon: 'lane', affix: true }
      }
    ]
  },
  {
    path: '/traffic-road',
    component: Layout,
    name: 'Setting',
    meta: {
      title: '系统设置',
      icon: 'el-icon-s-tools'
    },
    children: [
      {
        path: 'traffic-road',
        component: () => import('@/views/drawborad/road/road'),
        name: 'Road',
        meta: { title: '道路配置', icon: 'road', affix: true }
      },
      {
        path: 'cameras',
        component: () => import('@/views/drawborad/cameras/cameras'),
        name: 'Cameras',
        meta: { title: '监控列表', icon: 'el-icon-video-camera', affix: true }
      },
      {
        path: 'traffic-event-code',
        component: () => import('@/views/drawborad/event_code/event_code'),
        name: 'EventCode',
        meta: { title: '事件配置', icon: 'el-icon-warning', affix: true }
      },
      {
        path: 'traffic-lane-code',
        component: () => import('@/views/drawborad/lane_code/lane_code'),
        name: 'LaneCode',
        meta: { title: '车道配置', icon: 'fangxiang', affix: true }
      }
    ]
  },
  {
    path: '/coor_trans',
    component: Layout,
    children: [
      {
        path: 'coor_trans',
        component: () => import('@/views/drawborad/coor_trans/coor_trans'),
        name: 'CoorTrans',
        meta: { title: '坐标转换', icon: 'el-icon-d-arrow-right', affix: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: constantRoutes
})

export default router
