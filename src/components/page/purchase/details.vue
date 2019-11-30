<template>
  <div class="purchaseDetails">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 求购信息</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 90%">
        <el-form ref="form" :model="form"  label-width="150px">
          <el-form-item label="求购标题" prop="product_name">
            <el-input v-model="form.title" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="求购人" prop="user_name">
            <el-input v-model="form.user_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="求购人电话" prop="user_name">
            <el-input v-model="form.phone" placeholder="请输入发布人电话"></el-input>
          </el-form-item>
          <el-form-item label="心理价位" prop="company_type_name">
            <el-input v-model="form.psychological_price" placeholder="请输入价格"></el-input>
          </el-form-item>
            <el-form-item label="地区" prop="county">
              <el-input v-model="form.country" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="求购行业" prop="county">
              <el-input v-model="form.industry_name +'-'+form.industry_second_name" placeholder="请输入所属行业"></el-input>
            </el-form-item>

          <el-form-item label="投资主体" prop="company_type_name">
            <el-input v-model="form.investor_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="纳税类型" prop="company_type_name">
            <el-input v-model="form.tax_types_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="无形资产" prop="company_type_name">
            <el-input v-model="form.intangible_assets_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="微信支付" prop="company_type_name">
            <el-input v-model="form.wechat_pay" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="注册资金" prop="company_name">
            <el-input v-model="form.registered_capital" placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item label="成立年限" prop="county">
            <el-input v-model="form.years" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="求购需求" prop="county">
            <el-input type="textarea" rows="5" v-model="form.demand" placeholder=""></el-input>
          </el-form-item>

          <el-form-item>
            <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
            <el-button @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "purchaseDetails",
    data() {
      return {
        form: {},
      }
    },
    created() {
      this.modify = this.$route.query.modify ? this.$route.query.modify : '';
      if (this.modify) {
        let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
        this.form = formData;
      } else {
        this.form = {};
      }
    },
    watch: {
      $route(to, from) {
        if (from.path == '/finance' && to.path == "/financeDetail") {
          this.modify = this.$route.query.modify ? this.$route.query.modify : '';
          if (this.modify) {
            let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
            this.form = formData;
          } else {
            this.form = {};
          }
        }
      }
    },
    methods: {

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
  .purchaseDetails {
  }
</style>
