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
        <el-button type="primary" icon="el-icon-plus" @click="addCounty(0,0)">添加分类</el-button>
      </div>
      <!--default-expand-all-->
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="分类"></el-table-column>
        <el-table-column prop="is_show" label="是否导航展示">
          <template slot-scope="scope">
            <span v-if="scope.row.is_show == 1">是</span>
            <span v-if="scope.row.is_show == 0">否</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-plus" @click="addCounty(scope.row.id,scope.row.type)">添加
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="editName(scope.row)">修改
            </el-button>
            <el-button type="text" icon="el-icon-edit" v-if="scope.row.type>1" @click="delItem(scope.row.id)">删除
            </el-button>
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
        <el-form-item label="是否导航展示" prop="is_show">
          <el-radio-group v-model="form.is_show">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
        let rest = await this.$axios.CategoryDetails();
        let {code, result, msg} = rest;
        if (code == 200) {
          this.tableData = result.data
        } else {
          this.$message.error(msg);
        }
      },
      changeOrder() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.form));
            if (this.form.id > 0) {
              let rest = await this.$axios.editCategoryDetails(param);
              let {code, result, msg} = rest;
              if (code == 200) {
                this.$message.success('添加成功');
                this.showSure = false;
                this.init();
              } else {
                this.$message.error(msg);
              }
            } else {
              param.id = '';
              let rest = await this.$axios.addCategoryDetails(param);
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
      addCounty(id, type) {
        this.form = {
          pid: id,
          type: parseInt(type) + 1,
          name: '',
          id: 0,
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
          let rest = await this.$axios.deleteCategoryDetails(param);
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
