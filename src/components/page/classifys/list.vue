<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 分类管理</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" @click="addCounty(0,1,0)">添加分类</el-button>
      </div>
      <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-exp and-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="分类名称"
        sortable
        width="180">
      </el-table-column>
        <el-table-column label="操作" >
        <template slot-scope="scope">
<!--          <el-button type="text" v-if="scope.row.atype==1"  @click="$router.push('/Specss?id='+scope.row.id)" >规格管理</el-button>-->
          <el-button type="text" v-if="scope.row.atype==1" icon="el-icon-plus" @click="addCounty(scope.row.id,2,scope.row.id)">添加规格</el-button>
          <el-button type="text" v-if="scope.row.atype==1" icon="el-icon-plus" @click="addCounty(scope.row.id,scope.row.atype,0)">添加</el-button>
          <el-button type="text" v-if="scope.row.atype==1" icon="el-icon-edit" @click="editName(scope.row,scope.row.atype)">修改</el-button>
          <el-button type="text" v-if="scope.row.atype==1" icon="el-icon-edit" @click="delItem(scope.row.id,scope.row.atype)">删除</el-button>
<!--        </template>-->
<!--          <template slot-scope="scope"  v-if="scope.row.atype==2">-->
<!--            <el-button type="text" v-if="scope.row.atype==2"  @click="$router.push('/Attri?id='+scope.row.id)" >属性管理</el-button>-->
          <el-button type="text" v-if="scope.row.atype==2" icon="el-icon-plus" @click="addCounty(scope.row.id,3,scope.row.id)">添加属性</el-button>
            <el-button type="text" v-if="scope.row.atype==2" icon="el-icon-plus" @click="addCounty(scope.row.id,scope.row.atype,scope.row.upid)">添加</el-button>
            <el-button type="text" v-if="scope.row.atype==2" icon="el-icon-edit" @click="editName(scope.row,scope.row.atype)">修改</el-button>
            <el-button type="text" v-if="scope.row.atype==2" icon="el-icon-edit" @click="delItem(scope.row.id,scope.row.atype)">删除</el-button>

          <el-button type="text" v-if="scope.row.atype==3" icon="el-icon-plus" @click="addCounty(scope.row.id,scope.row.atype,scope.row.upid)">添加</el-button>
          <el-button type="text" v-if="scope.row.atype==3" icon="el-icon-edit" @click="editName(scope.row,scope.row.atype)">修改</el-button>
          <el-button type="text" v-if="scope.row.atype==3" icon="el-icon-edit" @click="delItem(scope.row.id,scope.row.atype)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    </div>
    <!--    新增  -->
    <el-dialog :title="form.id>0?'修改':'新增'" autocomplete="on" :visible.sync="showSure" width="500px" center>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="showSure = false">取 消</el-button>
          <el-button type="primary" @click="changeOrder()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // import http from '../../../assets/js/http';

  export default {
    name: "list",
    data() {
      return {
          tableData: [],
        showSure: false,
        form: {
          pid: -1,
          name: '',
          type: 0,
          id: -1,
          title_desc: '',
          is_show: 0,
          price: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          }],
        }
      }
    },
    created() {
      this.init();
    },
    methods: {
      async init() {
        let rest = await this.$axios.ClassifysDetails();
        let {code, result, msg} = rest;
        if (code == 200) {
            console.log(result.result.data)
          this.tableData = result.result.data
        } else {
          this.$message.error(msg);
        }
      },
      changeOrder() {
        this.$refs.form.validate(async (valid) => {
          let  rest=""
          if (valid) {
            if (this.form.id > 0) {
                let param = JSON.parse(JSON.stringify(this.form));
                if(this.form.atype==1){
                     rest = await this.$axios.editClassifysDetails(param);
                }else if(this.form.atype==2){
                    rest = await this.$axios.editSpecssDetails(param);
                }else{
                    rest = await this.$axios.editAttriDetails(param);
                }
              let {code, result, msg} = rest;
              if (code == 200) {
                this.$message.success('修改成功');
                this.showSure = false;
                this.init();
              } else {
                this.$message.error(msg);
              }
            } else {
                if(this.form.atype==1){
                    let param = JSON.parse(JSON.stringify(this.form));
                    param.id = '';
                     rest = await this.$axios.addClassifysDetails(param);
                }else if(this.form.atype==2){
                    this.form.classifyid= this.form.upid
                    let param = JSON.parse(JSON.stringify(this.form));
                    param.id = '';
                    rest = await this.$axios.addSpecssDetails(param);
                }else{
                    this.form.specsid= this.form.upid
                    let param = JSON.parse(JSON.stringify(this.form));
                    param.id = '';
                    rest = await this.$axios.addAttriDetails(param);
                }
              let {code, result, msg} = rest;
              if (code == 200) {
                this.$message.success('添加成功');
                this.showSure = false;
                this.init();
              } else {
                this.$message.error(msg);
              }
            }
          }
        });
      },
      addCounty(id, type,upid) {
        this.form = {
          pid: id,
            atype: type,
          name: '',
            upid: upid,
          id: 0,
            classifyid:this.$route.query.id,
          is_show:0
        };
        this.showSure = true;
      },
      editName(item) {
        this.form = item;
        this.showSure = true;
      },
      delItem(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let param = {
            id: id
          };
          let rest = await this.$axios.deleteClassifysDetails(param);
          let {code, result, msg} = rest;
          if (code == 200) {
            this.$message.success('删除成功');
            this.showSure = false;
            this.init();
          } else {
            this.$message.error(msg);
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
