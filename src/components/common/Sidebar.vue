<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
             text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from '../common/bus';

  export default {
    data() {
      return {
        collapse: false,
        items: [
          // {
          //   icon: 'el-icon-lx-home',
          //   index: 'sliderList',
          //   title: '轮播图管理',
          //   subs:[
          //     {
          //       index: 'sliderList',
          //       title: '广告图管理'
          //     },
          //
          //   ]
          // },
          {
            icon: 'el-icon-lx-apps',
            index: 'Classifys',
            title: '分类管理',
            subs: [
              {
                index: 'Classifys',
                title: '分类管理'
              },
            ]
          },
            {
                icon: 'el-icon-lx-exit',
                index: 'GoodList',
                title: '商品管理',
                subs: [
                    {
                        index: 'GoodList',
                        title: '商品列表'
                    },
                ]
            },
            {
                icon: 'el-icon-lx-exit',
                index: 'OrderList',
                title: '订单管理',
                subs: [
                    {
                        index: 'OrderList',
                        title: '订单列表'
                    },
                ]
            },
            // {
            //     icon: 'el-icon-lx-apps',
            //     index: 'categoryList',
            //     title: '规格管理',
            //     subs: [
            //         {
            //             index: 'categoryList',
            //             title: '规格列表'
            //         },
            //     ]
            // },
          // {
          //   icon: 'el-icon-lx-exit',
          //   index: 'assignment',
          //   title: '企业转让',
          //   subs: [
          //     {
          //       index: 'assignment',
          //       title: '企业转让列表'
          //     }
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-cart',
          //   index: 'purchase',
          //   title: '求购信息',
          //   subs: [
          //     {
          //       index: 'purchase',
          //       title: '买家求购列表'
          //     },
          //     {
          //       index: 'orders',
          //       title: '求购订单'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-group',
          //   index: 'users',
          //   title: '用户管理',
          //   subs: [
          //     {
          //       index: 'users',
          //       title: '用户列表'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-service',
          //   index: 'customer',
          //   title: '客服管理',
          //   subs: [
          //     {
          //       index: 'customer',
          //       title: '客服列表'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-global',
          //   index: 'transaction',
          //   title: '交易指数',
          //   subs: [
          //     {
          //       index: 'dynamic',
          //       title: '交易指数管理'
          //     },
          //     {
          //       index: 'transaction',
          //       title: '交易动态'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-service',
          //   index: 'featured',
          //   title: '精选服务',
          //   subs: [
          //     {
          //       index: 'featured',
          //       title: '精选服务列表'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-addressbook',
          //   index: 'industry',
          //   title: '工商服务',
          //   subs: [
          //     {
          //       index: 'combo',
          //       title: '套餐列表'
          //     },
          //     {
          //       index: 'industry',
          //       title: '工商服务列表'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-recharge',
          //   index: 'finance',
          //   title: '财税服务',
          //   subs: [
          //     {
          //       index: 'finance',
          //       title: '财税服务列表'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-question',
          //   index: 'facebook',
          //   title: '投诉建议',
          //   subs: [
          //     {
          //       index: 'facebook',
          //       title: '投诉建议列表'
          //     },
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-cascades',
          //   index: 'table',
          //   title: '基础表格'
          // },
          // {
          //   icon: 'el-icon-lx-copy',
          //   index: 'tabs',
          //   title: 'tab选项卡'
          // },
          // {
          //   icon: 'el-icon-lx-calendar',
          //   index: '3',
          //   title: '表单相关',
          //   subs: [
          //     {
          //       index: 'form',
          //       title: '基本表单'
          //     },
          //     {
          //       index: '3-2',
          //       title: '三级菜单',
          //       subs: [
          //         {
          //           index: 'editor',
          //           title: '富文本编辑器'
          //         },
          //         {
          //           index: 'markdown',
          //           title: 'markdown编辑器'
          //         },
          //       ]
          //     },
          //     {
          //       index: 'upload',
          //       title: '文件上传'
          //     }
          //   ]
          // },
          // {
          //   icon: 'el-icon-lx-emoji',
          //   index: 'icon',
          //   title: '自定义图标'
          // },
          // {
          //   icon: 'el-icon-lx-favor',
          //   index: 'charts',
          //   title: 'schart图表'
          // },
          // {
          //   icon: 'el-icon-rank',
          //   index: 'drag',
          //   title: '拖拽列表'
          // },
          // {
          //   icon: 'el-icon-lx-warn',
          //   index: '6',
          //   title: '错误处理',
          //   subs: [
          //     {
          //       index: 'permission',
          //       title: '权限测试'
          //     },
          //     {
          //       index: '404',
          //       title: '404页面'
          //     }
          //   ]
          // }
        ]
      }
    },
    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      }
    },
    created() {
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })
    }
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
