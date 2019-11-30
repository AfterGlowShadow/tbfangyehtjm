<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 交易指数</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="add" class="handle-del mr10" @click="addOne">添加</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column prop="id" label="序号" width="100" align="center" sortable>
        </el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
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
    <el-dialog :title="form.id?'修改':'添加'" :visible.sync="delVisible" width="500px" center>
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item label="内容">
          <el-input type="textarea" rows="5" v-model="form.content"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="comfireAdd">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "list",
    data() {
      return {
        tableData: [],
        form: {
          content: "",
          id: ''
        },
        imgUrl: "",
        page: 1,
        size: 10,
        count: 0,
        delVisible: false
      }
    },
    created() {
      this.imgUrl = this.$imgurl;
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
        let rest = await this.$axios.getMessages(params);
        let {code, result, msg} = rest;
        this.count = result.total;
        if (code == 200) {
          this.tableData = result.data;
        }
      },
      handleEdit(item) {
        this.form = item;
        this.delVisible = true;
      },
      handleDelete(pictureId, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let rest = await this.$axios.deleteMessages({id: pictureId,softDel:1});
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
      addOne() {
        this.form = {
          content: "",
          id: ''
        };
        this.delVisible = true;
      },
      async comfireAdd() {
        this.delVisible = false;
        let params = {
          content: this.form.content
        };
        let tempapi = 'addMessages';
        if(this.form.id > 0){
          tempapi = 'editMessages';
          params.id = this.form.id
        }
        let rest = await this.$axios[tempapi](params);
        let {result, msg, code} = rest;
        if (code == 200) {
          this.$message.success('成功');
          this.getData();
        } else {
          this.$message({
            type: 'info',
            message: msg
          });
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .list {
  }
</style>
