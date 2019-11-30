<template>
  <div class="modifyPwd">
    <div class="content" style="width: 50%;overflow: hidden;">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="twoPassword">
          <el-input v-model="form.twoPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="$router.go(-1)">返 回</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  // import md5 from "js-md5";

  export default {
    name: "modifyPwd",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.password !== '') {
            // this.$refs.form.validateField('password');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        form: {
          oldPassword: '',
          newPassword: '',
          twoPassword: ''
        },
        rules: {
          newPassword: [{
            validator: validatePass,
            trigger: 'blur',
            required: true,
          }],
          twoPassword: [{
            validator: validatePass2,
            trigger: 'blur',
            required: true,
          }],
          oldPassword: [{
            required: true,
            message: '请添加原始密码',
            trigger: 'blur'
          }],
        },
        userName:'',
      }
    },
    created(){
      let user = sessionStorage.getItem('ms_username');
      if (user) {
        this.userName = JSON.parse(user).userName;
      } else {
        this.$router.push('/')
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const param = new FormData();
            param.append("oldPassword",this.form.oldPassword);
            param.append("newPassword",this.form.newPassword);
            param.append("twoPassword",this.form.twoPassword);
            param.append("userName",this.userName);
            let rest = await this.$axios.post(this.$url + 'user/resetUserPassword', param, 2);
            // this.$axios.post(this.$url+ "user/resetUserPassword", param).then((res) => {
              let {data, msg, code} = rest;
              if (code == 200) {
                this.$alert('修改成功', '温馨提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.form = {};
                    sessionStorage.removeItem("ms_username");
                    this.$router.push("/login");
                  }
                });
              } else {
                this.$message({
                  type: 'info',
                  message: msg
                });
              }
            // })
          // } else {
          //   return false;
          }
        });
      },
    },
  }
</script>

<style scoped>
  .modifyPwd{
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
</style>

