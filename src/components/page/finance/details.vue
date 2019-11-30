<template>
  <div class="details">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 财税服务</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 90%">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="标题描述" prop="title_desc">
            <el-input v-model="form.title_desc" placeholder="请输入标题描述"></el-input>
          </el-form-item>
          <el-form-item label="市场价" prop="shop_price">
            <el-input v-model="form.shop_price" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="服务类型" prop="service_type">
            <el-select v-model="form.service_type" placeholder="请选择" @change="selectService">
              <el-option :key="key" :label="item.name" :value="item.id" v-for="(item,key) in serviceList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区" prop="address">
            <el-select v-model="form.address" placeholder="请选择">
              <el-option :key="key" :label="item.name" :value="item.name"
                         v-for="(item,key) in citysList.children"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import citys from '../../../assets/lib/province'

  export default {
    name: "financeDetail",
    data() {
      return {
        form: {
          id: '',
          title: '',
          title_desc: '',
          shop_price: '',
          price: '',
          service_type: '',
          service_name: '',
          address: '',
        },
        comboList: [],
        categoryList: [],
        citysList: [],
        secondCategoryList: [],
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
          ],
          title_desc: [
            {required: true, message: '请输入描述', trigger: 'blur'}
          ],
          shop_price: [
            {required: true, message: '请输入市场价格', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'}
          ],
          service_type: [
            {required: true, message: '请选择服务类型', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请选择地区', trigger: 'blur'}
          ],
        },
      }
    },
    created() {
      this.modify = this.$route.query.modify ? this.$route.query.modify : '';
      if (this.modify) {
        let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
        this.form = {
          id: formData.id,
          title: formData.title,
          title_desc: formData.title_desc,
          shop_price: formData.shop_price,
          price: formData.price,
          service_type: formData.service_type,
          service_name: formData.service_name,
          address: formData.address,
        };
      } else {
        this.form = {
          id: '',
          title: '',
          title_desc: '',
          shop_price: '',
          price: '',
          service_type: '',
          service_name: '',
          address: '',
        };
      }
      this.getTreeById();
      this.citysList = citys;
    },
    computed: {
      serviceList() {
        let categoryOne = [];
        this.categoryList.forEach((item, key) => {
          if (item.name == '服务类型') {
            categoryOne = item.children;
          }
        });
        return categoryOne;
      },
    },
    watch: {
      $route(to, from) {
        if (from.path == '/finance' && to.path == "/financeDetail") {
          this.modify = this.$route.query.modify ? this.$route.query.modify : '';
          if (this.modify) {
            let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
            this.form = {
              id: formData.id,
              title: formData.title,
              title_desc: formData.title_desc,
              shop_price: formData.shop_price,
              price: formData.price,
              service_type: formData.service_type,
              service_name: formData.service_name,
              address: formData.address,
            };
          } else {
            this.form = {
              id: '',
              title: '',
              title_desc: '',
              shop_price: '',
              price: '',
              service_type: '',
              service_name: '',
              address: '',
            };
          }
        }
      }
    },
    methods: {
      async getTreeById() {
        let params = {
          pid: 3,
          get_son: 1
        };
        let rest = await this.$axios.getTreeById(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          this.categoryList = result;
        }
      },
      selectService(e) {
        for (let serviceListKey in this.serviceList) {
          if (this.serviceList[serviceListKey].id == e) {
            this.form.service_name = this.serviceList[serviceListKey].name;
          }
        }
      },
      onSubmit() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.form));
            let tempapi = 'addFinances';
            if (this.form.id > 0) {
              tempapi = 'editFinances';
            }
            let rest = await this.$axios[tempapi](params);
            let {result, msg, code} = rest;
            if (code == 200) {
              this.$message.success('成功');
              this.$router.go(-1);
            } else {
              this.$message({
                type: 'info',
                message: msg
              });
            }
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .details {
  }
</style>
