<template>
  <div class="details">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 企业转让</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="form-box" style="width: 90%">
        <el-form ref="form" :model="form"  label-width="150px">
          <el-form-item label="商品名" prop="product_name">
            <el-input v-model="form.product_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="发布人" prop="user_name">
            <el-input v-model="form.user_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="发布人电话" prop="user_name">
            <el-input v-model="form.phone" placeholder="请输入发布人电话"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="company_type_name">
            <el-input v-model="form.sell_price" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="企业类型" prop="company_type_name">
            <el-input v-model="form.company_type_name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="企业名称" prop="company_name">
            <el-input v-model="form.company_name" placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item label="地区" prop="county">
            <el-input v-model="form.county" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="注册号/统一社会信用代码" prop="county">
            <el-input v-model="form.credit_code" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="纳税类型" prop="county">
            <el-input v-model="form.pay_taxes" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="报税情况" prop="county">
            <el-input v-model="form.declare_tax" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="是否申领过发票" prop="county">
            <el-input v-model="form.recive_invoice" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="有无网银" prop="county">
            <el-input v-model="form.internetbank" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="银行账户" prop="county">
            <el-input v-model="form.internetbank" placeholder="请输入银行账户"></el-input>
          </el-form-item>
          <el-form-item label="QQ号" prop="county">
            <el-input v-model="form.qq" placeholder="请输入QQ号"></el-input>
          </el-form-item>
          <el-form-item label="所属行业" prop="county">
            <el-input v-model="form.industry_name +'-'+form.industry_second_name" placeholder="请输入所属行业"></el-input>
          </el-form-item>
          <el-form-item label="成立日期" prop="county">
            <el-input v-model="form.establishment" placeholder="请输入成立日期"></el-input>
          </el-form-item>
          <el-form-item label="注册资本" prop="county">
            <el-input v-model="form.registered_capital" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="实缴资本" prop="county">
            <el-input v-model="form.contributed_capital" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="法人姓名" prop="county">
            <el-input v-model="form.legal_person" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="营业执照" prop="county">
            <img class="avatar_img" :src="this.$imgurl + form.business_license" alt="">
          </el-form-item>
          <el-form-item label="经营范围" prop="county">
            <el-input type="textarea" rows="5" v-model="form.business_scope" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="其他信息" prop="county">
            <el-input type="textarea" rows="5" v-model="form.other_infomation" placeholder=""></el-input>
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
    name: "assignmentDetails",
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
        if (from.path == '/assignment' && to.path == "/assignmentDetails") {
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
  .details {
  }
</style>
