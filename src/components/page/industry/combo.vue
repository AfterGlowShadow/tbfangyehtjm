<template>
  <div class="combo">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 工商服务</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" class="el-icon-lx-add" @click="addCustomer"> 添加</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="id" label="序号" width="100" align="center" sortable>
        </el-table-column>
        <el-table-column prop="name" label="套餐名"></el-table-column>
        <el-table-column prop="cat_names" label="内容"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.row.id, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
    <!--    新增  -->
    <el-dialog :title="form.id>0?'修改':'新增'" autocomplete="on" :visible.sync="showSure" width="500px" center>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="is_show">
          <el-checkbox-group v-model="form.cats">
            <el-checkbox :label="item.id.toString()" name="type" v-for="(item,key) in categoryList" :key="key">{{item.name}}</el-checkbox>
          </el-checkbox-group>
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
  export default {
    name: "combo",
    data() {
      return {
        tableData: [],
        form: {
          name: '',
          cats: [],
          cat_ids: '',
          cat_names: ''
        },
        imgUrl: "",
        page: 1,
        size: 10,
        count: 0,
        categoryList: [],
        showSure: false
      }
    },
    created() {
      this.getTreeById();
      this.getData();
    },
    methods: {
      // 分页导航
      handleCurrentChange(val) {
        this.page = val;
        this.getData();
      },
      // 获取 easy-mock 的模拟数据
      async getData() {
        let params = {
          page_num: this.page,
          page_limit: this.size
        };
        let rest = await this.$axios.getCombos(params);
        let {code, result, msg} = rest;
        this.count = result.total;
        if (code == 200) {
          this.tableData = result.data;
        }
      },
      async getTreeById() {
        let params = {
          pid: 20,
          get_son: 0
        };
        let rest = await this.$axios.getTreeById(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          this.categoryList = result.data;
        }
      },
      handleEdit(item) {
        this.form = {
          id:item.id,
          name: item.name,
          cats: item.cat_ids.split(','),
          cat_ids: item.cat_ids,
          cat_names: item.cat_names
        };
        this.showSure = true;
      },
      search() {
        this.getData();
      },
      addCustomer() {
        this.form = {
          id:'',
          name: '',
          cats: [],
          cat_ids: '',
          cat_names: ''
        };
        this.showSure = true;
      },
      async changeOrder() {
        this.form.cat_ids = this.form.cats.join(',');
        let cat_names = [];
        this.categoryList.forEach((item, key) => {
          if (this.form.cats.indexOf(item.id.toString()) != -1) {
            cat_names.push(item.name);
          }
        });
        let params = {
          name: this.form.name,
          cat_ids: this.form.cat_ids,
          cat_names: cat_names.join(',')
        };
        let tempapi = 'addCombos';
        if (this.form.id > 0) {
          params.id = this.form.id;
          tempapi = 'editCombos';
        }
        let rest = await this.$axios[tempapi](params);
        let {result, msg, code} = rest;
        if (code == 200) {
          this.$message.success('成功');
          this.showSure = false;
          this.getData();
        } else {
          this.$message({
            type: 'info',
            message: msg
          });
        }
      },
      handleDelete(pictureId, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let rest = await this.$axios.deleteCombos({id: pictureId,softDel:1});
          let {data, msg, code} = rest;
          if (code == 200) {
            this.$alert('删除成功', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.getData();
              }
            });
          } else {
            this.$message({
              type: 'info',
              message: msg
            });
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .combo {

  }
</style>
