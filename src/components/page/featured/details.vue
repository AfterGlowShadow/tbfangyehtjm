<template>
  <div class="details">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 精选服务</el-breadcrumb-item>
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
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="url">
            <el-input v-model="form.url" placeholder="请输入跳转链接"></el-input>
          </el-form-item>
          <el-form-item label="是否热销" prop="is_hot">
            <el-radio-group v-model="form.is_hot">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
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
  export default {

    name: "featuredDetails",
    data() {
      return {
        form: {
          title: '',
          title_desc: '',
          price: '',
          url: '',
          is_hot: '',
        },
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
          ],
          title_desc: [
            {required: true, message: '请输入描述', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请输入跳转链接', trigger: 'blur'}
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
          price: formData.price,
          url: formData.url,
          is_hot: formData.is_hot
        };
        this.uploadUrl = this.$imgurl + formData.head_img;
      } else {
        this.form = {
          id: '',
          title: '',
          title_desc: '',
          price: '',
          url: '',
          is_hot: 0,
        };
      }
    },
    watch: {
      $route(to, from) {
        if (from.path == '/featured' && to.path == "/featuredDetails") {
          this.uploadUrl = "";
          this.modify = this.$route.query.modify ? this.$route.query.modify : '';
          if (this.modify) {
            let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
            this.form = {
              id: formData.id,
              title: formData.title,
              title_desc: formData.title_desc,
              price: formData.price,
              url: formData.url,
              is_hot: formData.is_hot
            };
            this.uploadUrl = this.$imgurl + formData.head_img;
          } else {
            this.form = {
              id: '',
              title: '',
              title_desc: '',
              price: '',
              url: '',
              is_hot: 0,
            };
          }
        }
      }
    },
    methods: {
      onSubmit() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.form));
            let tempapi = 'addBoutiques';
            if (this.form.id > 0) {
              tempapi = 'editBoutiques';
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
      async handleSuccess(file) {
        const isLt10M = file.size / 1024 / 1024 < 2
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10M!')
          return false
        } else {
          var formdata = new FormData();
          formdata.append('image', file.raw);
          let rest = await this.$axios.uploadImg(formdata);
          let {code, result, msg} = rest;
          if (code == 200) {
            this.uploadUrl = result.src_domain;
            this.form.head_img = result.src;
          } else {
            this.$message.error(msg);
          }
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png' || file.type === 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('图片格式不正确!');
          return;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!');
          return
        }
        return isJPG && isLt2M;
      },
    }
  }
</script>

<style scoped lang="scss">
  .details {
  }
</style>
