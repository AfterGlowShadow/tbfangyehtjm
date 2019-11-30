<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="name">
          <el-select v-model="form.classifyid" placeholder="选择分类" @change="FLChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宣传页价格" prop="name">
          <el-input v-model="form.price" type="number" @blur="PriceValidate(form.price)"></el-input>
        </el-form-item>
        <el-form-item label="宣传标题" prop="name">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="宣传描述" prop="name">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="name">
          <quill-editor ref="myTextEditor" v-model="form.content" class="ql-editor" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="规格" prop="name">
          <el-form-item :label="item.name" prop="name" v-for="(item,index) in form.specs" :key="index">
            <el-input v-model="item.price" type="number" @blur="PriceValidate(item.price)">{{item.price}}</el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即添加</el-button>
<!--          <el-button @click="resetForm('form')">重置</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    // import http from '../../../assets/js/http';
    import "quill/dist/quill.core.css";
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {Vue} from 'Vue';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        name: "list",
        data() {
            return {
                showSure: false,
                attrlist:[],
                options:[],
                editorOption: {
                    placeholder: 'Hello World'
                },
                form: {
                    pid: -1,
                    goodsname: '',
                    type: 0,
                    id: this.$route.query.id,
                    title_desc: '',
                    is_show: 0,
                    content:'',
                    price: '',
                    specs:[]
                },
                rules: {
                    goodsname: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                        { required: true, classifyid: '请选择商品分类', trigger: 'blur' },
                        { required: true, price: '请输入宣传页价格', trigger: 'blur' },
                        { required: true, title: '请输入宣传标题', trigger: 'blur' },
                        { required: true, content: '请输入详情', trigger: 'blur' },
                    ]
                }
            }
        },
        components: {
            quillEditor
        },
        created() {
            this.init();
        },
        methods: {
            PriceValidate(price){
                let data = parseFloat(price)
                if(data!=0){
                    if(parseInt(data*100)/100-data!=0){
                        this.$message({
                            showClose: true,
                            message: '金额必须填写,且只能输入到分',
                            type: 'warning'
                        });
                        return 0;
                    }
                }else{
                    this.$message({
                        showClose: true,
                        message: '金额不能0',
                        type: 'warning'
                    });
                    return 0;
                }
                return 1;
            },
            onEditorChange({ editor, html, text }) {
                this.form.content = html;
            },
            async FLChange(value) {
                let param = {
                    id: value
                }
                this.form.classify=value;
                this.form.specs=[]
                let rest = await this.$axios.AttrisArray(param);
                let {code, result, msg} = rest;
                if (code == 200) {
                    result.result.attr.forEach((k,v)=>{
                        this.form.specs.push(k)
                    });
                } else {
                    this.$message.error(msg);
                }
            },
            async init() {
                //获取分类
                let rest1 = await this.$axios.Classifys();
                if (rest1.code == 200) {
                    this.options = rest1.result.data
                } else {
                    this.$message.error(msg);
                }
                //获取详细单个信息
                let param={
                    id:this.$route.query.id
                }
                let rest = await this.$axios.getGoodById(param);
                let {code, result, msg} = rest;
                if (code == 200) {
                    if(result != undefined && result.length!="" ){
                        this.form = result
                        this.form.classifyid=this.form.classify;
                    }
                } else {
                    this.$message.error(msg);
                }
                console.log(this.options)
            },
            submitForm() {
                this.$refs.form.validate(async (valid) => {
                    if(this.PriceValidate(this.form.price)){
                        if(this.form.specs){
                            this.form.specs.forEach((k,v)=>{
                                if(!this.PriceValidate(k.price)){
                                  return false;
                                }
                            })
                        }
                        if (valid) {
                           if (this.form.id > 0) {
                               let param = JSON.parse(JSON.stringify(this.form));
                               param.specs=JSON.stringify(this.form.specs)
                                let rest = await this.$axios.editGoodDetails(param);
                                let {code, result, msg} = rest;
                                if (code == 200) {
                                    this.$message.success('修改成功');
                                    this.showSure = false;
                                    this.init();
                                } else {
                                    this.$message.error(msg);
                                }
                            } else {
                                this.form.id = "";
                                let param = JSON.parse(JSON.stringify(this.form));
                                param.specs=JSON.stringify(this.form.specs)
                                let rest = await this.$axios.addGoodDetails(param);
                                let {code, result, msg} = rest;
                                if (code == 200) {
                                    this.$message.success('添加成功');
                                    this.$router.push("/GoodList");
                                } else {
                                    this.$message.error(msg);
                                }
                            }
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
