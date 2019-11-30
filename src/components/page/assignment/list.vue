<template>
  <div class="sliderList">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 企业转让</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="keywords" placeholder="请输入申请人姓名/手机号/企业名称" class="handle-input mr10"></el-input>
        <el-select v-model="status" placeholder="请选择状态" class="handle-select mr10">
          <el-option label="全部" value=""></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="在售中" :value="2"></el-option>
          <el-option label="交接中" :value="3"></el-option>
          <el-option label="已售出" :value="4"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column prop="order_sn" label="编号"></el-table-column>
        <el-table-column prop="user_name" label="申请人" width="100" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" width="100" align="center"></el-table-column>
        <el-table-column prop="company_name" label="企业名称"></el-table-column>
        <el-table-column prop="qq" label="QQ好"></el-table-column>
        <el-table-column prop="legal_person" label="法人姓名"></el-table-column>
        <el-table-column prop="celection_num" label="收藏数量"></el-table-column>
        <el-table-column prop="view_num" label="申请数量"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status ==1" class="red">待审核</span>
            <span v-if="scope.row.status ==2">在售中</span>
            <span v-if="scope.row.status ==3">交接中</span>
            <span v-if="scope.row.status ==4">已售出</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="申请时间">
          <template slot-scope="scope" v-if="scope.row.create_time">
            <span>{{scope.row.create_time | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">查看</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row,2)" v-if="scope.row.status == 1">审核通过</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row,5)" v-if="scope.row.status == 1">审核拒绝</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row,3)" v-if="scope.row.status == 2">交接</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row,4)" v-if="scope.row.status == 3">确认售出</el-button>
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
        tableData: [],
        form: {
          name: '',
          date: '',
          address: ''
        },
        page: 1,
        size: 10,
        count: 0,
        keywords:'',
        status:null
      }
    },
    created() {
      this.getData();
    },
    methods: {
      // 分页导航
      handleCurrentChange(val) {
        this.page = val;
        this.getData();
      },
      async getData() {
        let params = {
          page_num: this.page,
          page_limit: this.size
        };
        if(this.keywords){
          params.keywords = this.keywords
        }
        if(this.status && this.status != null){
          params.status = this.status
        }
        let rest = await this.$axios.YsssList(params);
        let {code, result, msg} = rest;
        this.count = result.total;
        if (code == 200) {
          this.tableData = result.data;
        }
      },
      handleEdit(item) {
        sessionStorage.setItem('taskMessage', JSON.stringify(item));
        this.$router.push({
          path: "/assignmentDetails",
          query: {
            modify: 1
          }
        });
      },
      handleStatus(item,status){
        let title = '确定要审核通过么？';
        if(status == 3){
          let title = '确定要改为交接中么？';
        }else if(status == 4){
          let title = '确定要改为已售出么？';
        }else if(status == 5){
          let title = '确定要审核拒绝么？';
        }
        this.$confirm(title, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            status:status,
            id:item.id
          }
          let rest = await this.$axios.setStatusYsss(params);
          let {data, msg, code} = rest;
          if (code == 200) {
            this.$alert('操作成功', '温馨提示', {
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
      search() {
        this.getData();
      },
      handleDelete(pictureId, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let rest = await this.$axios.deleteYsss({id: pictureId,softDel:1});
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

