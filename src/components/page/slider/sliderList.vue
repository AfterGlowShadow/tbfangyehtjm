<template>
  <div class="sliderList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 轮播图管理</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="search" @click="search">添加轮播图</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column prop="id" label="序号" width="100" align="center" sortable>
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="img" label="缩略图">
          <template slot-scope="scope">
            <!--<img :src="imgUrl + scope.row.pictureUr" alt="">-->
            <img :src="imgUrl + scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接">
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
    name: "sliderList",
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
        imgUrl: "",
        page: 1,
        size: 10,
        count: 0,
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
        let rest = await this.$axios.sliderList(params);
        let {code, result, msg} = rest;
        this.count = result.total;
        if (code == 200) {
          this.tableData = result.data;
        }
      },
      handleEdit(item) {
        sessionStorage.setItem('taskMessage', JSON.stringify(item));
        this.$router.push({
          path: "/slider",
          query: {
            modify: 1
          }
        });
      },
      search() {
        sessionStorage.removeItem('taskMessage')
        // this.is_search = true;
        this.$router.push({
          path: "/slider"
        });
      },
      handleDelete(pictureId, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let rest = await this.$axios.deleteSliders({id: pictureId,softDel:1});
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
  .sliderList {
    .container {
      .handle-box {
        margin-bottom: 15px;
      }

      .el-table__row {
        .cell {
          img {
            max-height: 100px;
          }
        }
      }
    }
  }
</style>

