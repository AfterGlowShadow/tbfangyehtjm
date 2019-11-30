<template>
  <div class="slider">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 轮播图管理</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box">
        <el-form ref="form" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="链接">
            <el-input v-model="form.url" placeholder="http(s)://"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" rows="5" v-model="form.intro"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              class="upload-demo"
              name="img"
              drag
              action=""
              accept="image/jpeg,image/gif,image/png"
              :show-file-list="false"
              :on-change="imgPreview"
              :auto-upload="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="uploadUrl" :src="uploadUrl" class="avatar">
              <i v-else class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="primary" @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  // import VueCropper from 'vue-cropperjs';

  export default {
    name: 'slider',
    data: function () {
      return {
        form: {
          id: '',
          picture_class: 0,
          picture_skip: '',
          url: '',
          // className:'',
        },
        uploadUrl: "",
        imageUrl: '',
        modify: 0,
        url: '',
        sign: 0,
        positions: [],
      }
    },
    created() {
      this.imageUrl = this.$imgurl;
      this.uploadUrl = "";
      this.modify = this.$route.query.modify ? this.$route.query.modify : '';
      if (this.modify) {
        let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
        this.form = {
          id: formData.id,
          url: formData.url,
          title: formData.title,
          intro: formData.intro,
          img: formData.img
        };
        this.uploadUrl = this.$imgurl + formData.img;
      } else {
        this.form = {
          id: '',
          // picture_class: parseInt(formData.picture_class),
          // picture_class: 3,
          url: '',
          title: '',
          intro: '',
          img: ''
        };
      }
    },
    watch: {
      $route(to, from) {
        this.uploadUrl = "";
        this.modify = this.$route.query.modify ? this.$route.query.modify : '';
        if (this.modify) {
          let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
          this.form = {
            id: formData.id,
            // picture_class: parseInt(formData.picture_class),
            // picture_class: 3,
            url: formData.url,
            title: formData.title,
            intro: formData.intro,
            img: formData.img
          };
          this.uploadUrl = this.$imgurl + formData.img;
        } else {
          this.form = {
            id: '',
            // picture_class: parseInt(formData.picture_class),
            // picture_class: 3,
            url: '',
            title: '',
            intro: '',
            img: ''
          };
          this.uploadUrl = '';
        }
      },
    },
    methods: {
      async onSubmit() {
        if (this.form.url && !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(this.form.url)) {
          this.$message.error('请填写正确的链接！');
          return false;
        }
        if (!this.uploadUrl || !this.form.img) {
          this.$message.error('请先上传轮播图！');
          return false;
        }
        let params = JSON.parse(JSON.stringify(this.form));
        if (this.modify) {
          let rest = await this.$axios.editSliders(params);
          let {code, result, msg} = rest;
          if (code == 200) {
            this.$message.success('编辑成功!');
            this.$router.go(-1)
          } else {
            this.$message.error(msg);
          }
        } else {
          params.id = '';
          let rest = await this.$axios.addSliders(params);
          let {code, result, msg} = rest;
          if (code == 200) {
            this.$message.success('添加成功!');
            this.$router.go(-1)
          } else {
            this.$message.error(msg);
          }
        }
      },
      async imgPreview(file, fileList) {
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.png)$/;
        if (regex.test(fileName.toLowerCase())) {
          // this.uploadUrl = file.raw;
          // this.form.picture_url = URL.createObjectURL(file.raw);
          let params = new FormData();
          params.append('image', file.raw);
          let rest = await this.$axios.uploadImg(params);
          let {code, result, msg} = rest;
          if (code == 200) {
            this.uploadUrl = result.src_domain;
            this.form.img = result.src;
          } else {
            this.$message.error(msg);
          }
        } else {
          this.$message.error('请选择图片文件');
        }

      },
      //主图上传
      handleAvatarSuccess(res, file, fileList) {
        // this.masterImg=file.response.data
        this.form.picture_url = URL.createObjectURL(file.raw);
        this.uploadUrl = file.raw
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 1;

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
    },
  }
</script>

<style scoped lang="scss">
  .slider {
    .container {
      .el-upload{
        width: 610px !important;
        .el-upload-dragger{
          width: 100%;
        }
      }
      .avatar {
        height: 100%;
        max-width: 100%;
      }
    }
  }
</style>

