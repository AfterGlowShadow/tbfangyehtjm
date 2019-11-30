<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 客服管理</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="addCustomer">添加客服</el-button>
        <el-select v-model="status" placeholder="请选择状态" class="handle-select mr10">
          <el-option label="全部" value=""></el-option>
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
        </el-select>
        <el-input v-model="keywords" placeholder="客服姓名/手机号" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column prop="id" label="序号" width="100" align="center" sortable></el-table-column>
        <el-table-column prop="img" label="头像">
          <template slot-scope="scope">
            <!--<img :src="imgUrl + scope.row.pictureUr" alt="">-->
            <img class="thumb_img" :src="imgUrl + scope.row.head_img" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="honor" label="头衔"></el-table-column>
        <el-table-column prop="major_name" label="专业"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="qq" label="QQ"></el-table-column>
        <el-table-column prop="is_recommend" label="是否推荐">
          <template slot-scope="scope">
            <span v-if="scope.row.is_recommend == 1">是</span>
            <span v-if="scope.row.is_recommend == 0"> 否</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 0">禁用</span>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
  export default {
    name: "list",
    data() {
      return {
        tableData: [{
          id: 1,
          categoryName: '首页轮播图',
          pictureSkip: 'http://www.baidu.com'
        }],
        form: {
          name: '',
          date: '',
          address: ''
        },
        status:null,
        keywords:'',
        imgUrl: "",
        page: 1,
        size: 10,
        count: 0,
      }
    },
    watch: {
      $route(to, from) {
        if (from.path == '/customerDetails' && to.path == "/customer") {
          this.getData();
        }
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
        if(this.status !== '' && this.status != null){
          params.status = this.status;
        }
        if(this.keywords){
          params.keywords = this.keywords;
        }
        let rest = await this.$axios.getCustomers(params);
        let {code, result, msg} = rest;
        this.count = result.total;
        if (code == 200) {
          this.tableData = result.data;
        }
      },
      handleEdit(item) {
        sessionStorage.setItem('taskMessage', JSON.stringify(item));
        this.$router.push({
          path: "/customerDetails",
          query: {
            modify: 1
          }
        });
      },
      search() {
       this.getData();
      },
      addCustomer(){
        sessionStorage.removeItem('taskMessage');
        this.$router.push({
          path: "/customerDetails"
        });
      },
      handleDelete(pictureId, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let rest = await this.$axios.deleteCustomers({id: pictureId,softDel:1});
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
  .list {
  }
</style>
