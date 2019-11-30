<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 工商服务</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" class="el-icon-lx-add" @click="addCustomer"> 添加</el-button>
        <el-input v-model="keywords" placeholder="请输入标题关键字" class="handle-input mr10"></el-input>
        <el-select v-model="cat_id" placeholder="请选择所属分类">
          <el-option key="" label="全部" value=""></el-option>
          <el-option :key="key" :label="item.name" :value="item.id" v-for="(item,key) in categoryListOne" ></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="id" label="序号" width="100" align="center" sortable>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="title_desc" label="标题描述"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="shop_price" label="市场价"></el-table-column>
        <el-table-column prop="price" label="售价"></el-table-column>
        <el-table-column prop="collection_num" label="收藏数量"></el-table-column>
        <el-table-column prop="view_num" label="申请数量"></el-table-column>

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
        tableData: [],
        form: {
          name: '',
          date: '',
          address: ''
        },
        cat_id:null,
        imgUrl: "",
        page: 1,
        size: 10,
        count: 0,
        keywords: '',
        categoryList: []
      }
    },
    created() {
      this.getTreeById();
      this.getData();
    },
    computed: {
      categoryListOne() {
        let categoryOne = [];
        this.categoryList.forEach((item, key) => {
          if (item.is_show > 0) {
            categoryOne.push(item);
          }
        });
        return categoryOne;
      },
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
        if (this.keywords) {
          params.keywords = this.keywords;
        }
        if (this.cat_id && this.cat_id != null) {
          params.cat_id = this.cat_id;
        }
        let rest = await this.$axios.getIndustrysList(params);
        let {code, result, msg} = rest;
        this.count = result.total;
        if (code == 200) {
          this.tableData = result.data;
        }
      },
      async getTreeById() {
        let params = {
          pid: 2,
          get_son: 0
        };
        let rest = await this.$axios.getTreeById(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          this.categoryList = result.data;
        }
      },
      handleEdit(item) {
        sessionStorage.setItem('taskMessage', JSON.stringify(item));
        this.$router.push({
          path: "/industryDetail",
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
          path: "/industryDetail"
        });
      },
      handleDelete(pictureId, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let rest = await this.$axios.deleteUsers({id: pictureId,softDel:1});
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
