<template>
  <div class="details">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 客服管理</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="form-box" style="width: 90%">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="头衔" prop="honor">
            <el-input v-model="form.honor" placeholder="请输入头衔"></el-input>
          </el-form-item>
          <el-form-item label="照片" prop="head_img">
            <el-upload
              class="upload-demo"
              name="img"
              drag
              action="111"
              accept="image/jpeg,image/gif,image/png"
              :show-file-list="false"
              :on-change="handleSuccess"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false">
              <img v-if="uploadUrl" :src="uploadUrl" class="avatar">
              <i v-else class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过2M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="专业" prop="major_name">
            <el-input v-model="form.major_name" placeholder="请输入专业"></el-input>
          </el-form-item>
          <el-form-item label="QQ号" prop="qq">
            <el-input v-model="form.qq" placeholder="请输入QQ号"></el-input>
          </el-form-item>
          <el-form-item label="是否推荐" prop="is_recommend">
            <el-radio-group v-model="form.is_recommend">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
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
    name: "customerDetails",
    data() {
      // 设置手机号的验证规则
      const checkPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入联系方式'))
        } else {
          const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      }
      return {
        form: {
          name: '',
          head_img: '',
          honor: '',
          major_name: '',
          qq: '',
          phone: '',
          is_recommend: 0,
          status:1
        },
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {max: 5, message: "单病种名称最多5个字符", trigger: "blur"}
          ],
          head_img: [
            {required: true, message: '请上传照片', trigger: 'blur'}
          ],
          honor: [
            {required: true, message: '请输入头衔', trigger: 'blur'}
          ],
          major_name: [
            {required: true, message: '请输入专业', trigger: 'blur'}
          ],
          qq: [
            {required: true, message: '请输入QQ号', trigger: 'blur'}
          ],
          phone: [
            { required: true, validator: checkPhone, trigger: 'blur' }
          ]
        },
        uploadUrl: ''
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
          name: formData.name,
          head_img: formData.head_img,
          honor: formData.honor,
          major_name: formData.major_name,
          qq: formData.qq,
          phone: formData.phone,
          is_recommend: formData.is_recommend,
          status:formData.status
        };
        this.uploadUrl = this.$imgurl + formData.head_img;
      } else {
        this.form = {
          id: '',
          name: '',
          head_img: '',
          honor: '',
          major_name: '',
          qq: '',
          phone: '',
          is_recommend: 0,
          status:1
        };
      }
    },
    watch: {
      $route(to, from) {
        if (from.path == '/customer' && to.path == "/customerDetails") {
          this.uploadUrl = "";
          this.modify = this.$route.query.modify ? this.$route.query.modify : '';
          if (this.modify) {
            let formData = JSON.parse(sessionStorage.getItem('taskMessage'));
            this.form = {
              id: formData.id,
              name: formData.name,
              head_img: formData.head_img,
              honor: formData.honor,
              major_name: formData.major_name,
              qq: formData.qq,
              phone: formData.phone,
              is_recommend: formData.is_recommend,
              status:formData.status
            };
            this.uploadUrl = this.$imgurl + formData.head_img;
          } else {
            this.form = {
              id: '',
              name: '',
              head_img: '',
              honor: '',
              major_name: '',
              qq: '',
              phone: '',
              is_recommend: 0,
              status:1
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
            let tempapi = 'addCustomers';
            if(this.form.id > 0){
              tempapi = 'editCustomers';
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
