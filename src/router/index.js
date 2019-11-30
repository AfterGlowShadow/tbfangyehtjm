import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/sliderList'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {title: '系统管理'},
      children: [
        {
          path: '/Classifys',
          component: resolve => require(['../components/page/classifys/list.vue'], resolve),
          meta: {title: '分类列表'}
        },
        {
          path: '/GoodList',
          component: resolve => require(['../components/page/good/list.vue'], resolve),
          meta: {title: '商品列表'}
        },
        {
          path: '/GoodsAdd',
          component: resolve => require(['../components/page/good/add.vue'], resolve),
          meta: {title: '商品编辑'}
        },
        {
          path: '/Specss',
          component: resolve => require(['../components/page/specss/list.vue'], resolve),
          meta: {title: '规格列表'}
        },
        {
          path: '/Attri',
          component: resolve => require(['../components/page/attri/list.vue'], resolve),
          meta: {title: '属性列表'}
        },
        {
          path: '/OrderList',
          component: resolve => require(['../components/page/order/list.vue'], resolve),
          meta: {title: '订单列表'}
        },
        {
          path: '/modifyPwd',
          component: resolve => require(['../components/page/users/modifyPwd.vue'], resolve),
          meta: {title: '修改密码'}
        },
        {
          path: '/icon',
          component: resolve => require(['../components/page/Icon.vue'], resolve),
          meta: {title: '自定义图标'}
        },
        {
          path: '/table',
          component: resolve => require(['../components/page/BaseTable.vue'], resolve),
          meta: {title: '基础表格'}
        },
        {
          path: '/tabs',
          component: resolve => require(['../components/page/Tabs.vue'], resolve),
          meta: {title: 'tab选项卡'}
        },
        {
          path: '/form',
          component: resolve => require(['../components/page/BaseForm.vue'], resolve),
          meta: {title: '基本表单'}
        },
        {
          // 富文本编辑器组件
          path: '/editor',
          component: resolve => require(['../components/page/VueEditor.vue'], resolve),
          meta: {title: '富文本编辑器'}
        },
        {
          // markdown组件
          path: '/markdown',
          component: resolve => require(['../components/page/Markdown.vue'], resolve),
          meta: {title: 'markdown编辑器'}
        },
        {
          // 图片上传组件
          path: '/upload',
          component: resolve => require(['../components/page/Upload.vue'], resolve),
          meta: {title: '文件上传'}
        },
        {
          // vue-schart组件
          path: '/charts',
          component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
          meta: {title: 'schart图表'}
        },
        // {
        //     // 拖拽列表组件
        //     path: '/drag',
        //     component: resolve => require(['../components/page/DragList.vue'], resolve),
        //     meta: { title: '拖拽列表' }
        // },
        {
          // 权限页面
          path: '/permission',
          component: resolve => require(['../components/page/Permission.vue'], resolve),
          meta: {title: '权限测试', permission: true}
        },
        {
          path: '/404',
          component: resolve => require(['../components/page/common/404.vue'], resolve),
          meta: {title: '404'}
        },
        {
          path: '/403',
          component: resolve => require(['../components/page/common/403.vue'], resolve),
          meta: {title: '403'}
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/common/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
