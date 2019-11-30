<template>
  <div class="dynamic">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 交易指数</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="成交指数">
            <el-input v-model="form.exponent"></el-input>
          </el-form-item>
          <el-form-item label="上月成交">
            <el-input v-model="form.preceding"></el-input>
          </el-form-item>
          <el-form-item label="昨日成交">
            <el-input v-model="form.yesterday"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dynamic",
    data() {
      return {
        form: {
          exponent: '',
          preceding: '',
          yesterday: ''
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      async getData() {
        let params = {
          'var': 'TradingIndex'
        }
        let rest = await this.$axios.getVar(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          let tableData = result.value;
          this.form = JSON.parse(tableData);
        }
      },
      async onSubmit() {
        let params = {
          value: JSON.stringify(this.form),
          'var': 'TradingIndex',
          name: '交易指数',
          intro: '没有简介',
        };
        let rest = await this.$axios.setVar(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          this.$message.success('成功');
          this.getData();
        } else {
          this.$message.error(msg);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .dynamic {
  }
</style>
