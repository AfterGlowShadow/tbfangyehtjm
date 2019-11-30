<template>
  <div class="details">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 工商服务</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 90%">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="选择所属分类" prop="cat_second_id">
            <el-select v-model="form.cat_id" placeholder="请选择" @change="getCategoryList">
              <el-option :key="key" :label="item.name" :value="item.id"
                         v-for="(item,key) in categoryListOne"></el-option>
            </el-select>
            <el-select v-model="form.cat_second_id" placeholder="请选择" @change="getSecondCategoryList">
              <el-option :key="key" :label="item.name" :value="item.id"
                         v-for="(item,key) in secondCategoryList"></el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item label="服务行业" prop="service_type">
            <el-select v-model="form.service_type" placeholder="请选择"  @change="selectService">
              <el-option :key="key" :label="item.name" :value="item.id" v-for="(item,key) in serviceList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐" prop="meal_ids">
            <el-select v-model="form.meal_ids" placeholder="请选择" @change="selectCombo">
              <el-option :key="key" :label="item.name" :value="item.id" v-for="(item,key) in comboList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业类型" prop="company_type">
            <el-select v-model="form.company_type" placeholder="请选择" @change="selectCompany">
              <el-option :key="key" :label="item.name" :value="item.id" v-for="(item,key) in companyList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区" prop="address">
            <el-select v-model="form.address" placeholder="请选择">
              <el-option :key="key" :label="item.name" :value="item.name" v-for="(item,key) in citysList.children"></el-option>
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
    name: "industryDetail",
    data() {
      return {
        form: {
          cat_id: '',
          title: '',
          title_desc: '',
          shop_price: '',
          price: '',
          service_type: '',
          service_name: '',
          meal_name: '',
          meal_ids: '',
          company_type: '',
          company_name: '',
          address: '',
        },
        comboList: [],
        categoryList: [],
        citysList: [],
        secondCategoryList: [],
        rules: {
          cat_second_id: [
            {required: true, message: '请选择分类', trigger: ['blur', 'change']},
          ],
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
            {required: true, message: '请选择服务行业', trigger: 'blur'}
          ],
          meal_ids: [
            {required: true, message: '请选择套餐', trigger: 'blur'}
          ],
          company_type: [
            {required: true, message: '请选择企业类型', trigger: 'blur'}
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
          cat_id: formData.cat_id,
          cat_second_id: formData.cat_second_id,
          title: formData.title,
          title_desc: formData.title_desc,
          shop_price: formData.shop_price,
          price: formData.price,
          service_type: formData.service_type,
          service_name: formData.service_name,
          meal_name: formData.meal_name,
          meal_ids: formData.meal_ids,
          company_type: formData.company_type,
          company_name: formData.company_name,
          address: formData.address,
        };
      } else {
        this.form = {
          id: '',
          cat_id: '',
          cat_second_id: '',
          title: '',
          title_desc: '',
          shop_price: '',
          price: '',
          service_type: '',
          service_name: '',
          meal_name: '',
          meal_ids: '',
          company_type: '',
          company_name: '',
          address: '',
        };
      }
      this.getTreeById();
      this.getComboList();
      this.citysList = citys;
    },
    watch: {
      $route(to, from) {
        if (from.path == '/industry' && to.path == "/industryDetail") {
          this.modify = this.$route.query.modify ? this.$route.query.modify : '';
          if (this.modify) {
            let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
            this.form = {
              id: formData.id,
              cat_id: formData.cat_id,
              cat_second_id: formData.cat_second_id,
              title: formData.title,
              title_desc: formData.title_desc,
              shop_price: formData.shop_price,
              price: formData.price,
              service_type: formData.service_type,
              service_name: formData.service_name,
              meal_name: formData.meal_name,
              meal_ids: formData.meal_ids,
              company_type: formData.company_type,
              company_name: formData.company_name,
              address: formData.address,
            };
          } else {
            this.form = {
              id: '',
              cat_id: '',
              cat_second_id: '',
              title: '',
              title_desc: '',
              shop_price: '',
              price: '',
              service_type: '',
              service_name: '',
              meal_name: '',
              meal_ids: '',
              company_type: '',
              company_name: '',
              address: '',
            };
          }
        }
      }
    },
    computed: {
      categoryListOne() {
        let categoryOne = [];
        this.categoryList.forEach((item, key) => {
          if (item.is_show > 0) {
            categoryOne.push(item);
          }
        });
        if (this.modify && categoryOne.length > 0) {
          categoryOne.forEach((item, key) => {
            item.children.forEach((it,k)=>{
              if (it.id == this.form.cat_second_id) {
                this.secondCategoryList = item.children;
              }
            })

          });
        }
        return categoryOne;
      },
      serviceList() {
        let categoryOne = [];
        this.categoryList.forEach((item, key) => {
          if (item.name == '服务行业') {
            categoryOne = item.children;
          }
        });
        return categoryOne;
      },
      companyList() {
        let categoryOne = [];
        this.categoryList.forEach((item, key) => {
          if (item.name == '企业类型') {
            categoryOne = item.children;
          }
        });
        return categoryOne;
      },

    },
    methods: {
      async getTreeById() {
        let params = {
          pid: 2,
          get_son: 1
        };
        let rest = await this.$axios.getTreeById(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          this.categoryList = result;
        }
      },
      getCategoryList(e) {
        this.form.cat_second_id = '';
        this.categoryListOne.forEach((item, key) => {
          if (item.id == e) {
            this.secondCategoryList = this.categoryList[key].children;
          }
        });
      },
      getSecondCategoryList(e) {
        this.secondCategoryList.forEach((item, key) => {
          if (item.id == e) {
            this.form.title = item.name;
          }
        });
      },
      async getComboList() {
        let params = {
          page_num: 1,
          page_limit: 1000
        };
        let rest = await this.$axios.getCombos(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          this.comboList = result.data;
        }
      },
      selectCompany(e){
        for (let companyListKey in this.companyList) {
          if(this.companyList[companyListKey].id == e){
            this.form.company_name = this.companyList[companyListKey].name;
          }
        }
      },
      selectCombo(e){
        for (let comboListKey in this.comboList) {
          if(this.comboList[comboListKey].id == e){
            this.form.meal_name = this.comboList[comboListKey].name;
          }
        }
      },
      selectService(e){
        for (let serviceListKey in this.serviceList) {
          if(this.serviceList[serviceListKey].id == e){
            this.form.service_name = this.serviceList[serviceListKey].name;
          }
        }
      },
      onSubmit() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.form));
            let tempapi = 'addIndustrys';
            if (this.form.id > 0) {
              tempapi = 'editIndustrys';
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
