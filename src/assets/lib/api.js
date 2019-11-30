import fetchs from './http'
import qs from 'qs'

const api = {

  // 用户登录
  async login(params) {
    return await fetchs.post('sys/admin/Rbac.v1.Users.login', qs.stringify(params), 1)
  },

  // 用户退出
  async logout(params) {
    return await fetchs.post('sys/admin/Rbac.v1.Users.logout', qs.stringify(params), 1)
  },
  // 上传图片
  async uploadImg(params) {
    return await fetchs.post('sys/api/Update.v1.Upload.uploadImg', params, 1);
  },

  // 分类管理
  async Classifys(params) {
    return await fetchs.post('app/admin/Attribute.v1.Classifys.getList', qs.stringify(params), 1);
  },
// 分类管理
  async ClassifysDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Classifys.getListM', qs.stringify(params), 1);
  },
  // 分类管理
  async addClassifysDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Classifys.addClass', qs.stringify(params), 1);
  },
  // 分类管理
  async editClassifysDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Classifys.editClass', qs.stringify(params), 1);
  },
  // 分类管理
  async deleteClassifysDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Classifys.delete', qs.stringify(params), 1);
  },
  // 分类管理
  async getTreeById(params) {
    return await fetchs.post('app/admin/Attribute.v1.Classifys.getItemById', qs.stringify(params), 1);
  },
  // 分类管理(根据分类获得属性列表)
  async AttrisArray(params) {
    return await fetchs.post('app/admin/Tb.v1.Goodss.AttrisArray', qs.stringify(params), 1);
  },

  // 规格管理
  async SpecssDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Specss.getList', qs.stringify(params), 1);
  },

  // 规格管理
  async addSpecssDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Specss.addSpecss', qs.stringify(params), 1);
  },
  // 规格管理
  async editSpecssDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Specss.editSpecss', qs.stringify(params), 1);
  },
  // 规格管理
  async deleteSpecssDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Specss.delete', qs.stringify(params), 1);
  },
  // 规格管理
  async getSpecssById(params) {
    return await fetchs.post('app/admin/Attribute.v1.Specss.getItemById', qs.stringify(params), 1);
  },

  // 属性管理
  async AttriDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Attris.getList', qs.stringify(params), 1);
  },
  // 属性管理
  async addAttriDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Attris.addAttr', qs.stringify(params), 1);
  },
  // 属性管理
  async editAttriDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Attris.editAttr', qs.stringify(params), 1);
  },
  // 属性管理
  async deleteAttriDetails(params) {
    return await fetchs.post('app/admin/Attribute.v1.Attris.delete', qs.stringify(params), 1);
  },
  // 属性管理
  async getAttriById(params) {
    return await fetchs.post('app/admin/Attribute.v1.Attris.getItemById', qs.stringify(params), 1);
  },

  //订单
  async OrderList(params) {
    return await fetchs.post('app/admin/Tb.v1.Orders.getListM', qs.stringify(params), 1);
  },
  //订单
  async deleteOrdersList(params) {
    return await fetchs.post('app/admin/Tb.v1.Orders.delete', qs.stringify(params), 1);
  },
  //订单
  async setStatusOrders(params) {
    return await fetchs.post('app/admin/Tb.v1.Orders.setStatus', qs.stringify(params), 1);
  },

  //订单
  async setCustomer(params) {
    return await fetchs.post('app/admin/Yss.v1.Orders.setCustomer', qs.stringify(params), 1);
  },

  // 商品管理
  async GoodDetails(params) {
    return await fetchs.post('app/admin/Tb.v1.Goodss.getListM', qs.stringify(params), 1);
  },
  // 商品管理
  async addGoodDetails(params) {
    return await fetchs.post('app/admin/Tb.v1.Goodss.addGoods', qs.stringify(params), 1);
  },
  // 商品管理
  async editGoodDetails(params) {
    return await fetchs.post('app/admin/Tb.v1.Goodss.editAttr', qs.stringify(params), 1);
  },
  // 商品管理
  async deleteGoodDetails(params) {
    return await fetchs.post('app/admin/Tb.v1.Goodss.delete', qs.stringify(params), 1);
  },
  // 商品管理
  async getGoodById(params) {
    return await fetchs.post('app/admin/Tb.v1.Goodss.getItemByIdM', qs.stringify(params), 1);
  },


};

export default api
