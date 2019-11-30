<template>
  <div class="orders">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 求购信息</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="keywords" placeholder="请输入购买人姓名/手机号" class="handle-input mr10"></el-input>
        <el-input v-model="keywords2" placeholder="请输入出售人姓名/手机号" class="handle-input mr10"></el-input>
        <el-select v-model="status" placeholder="请选择状态" class="handle-select mr10">
          <el-option label="全部" value=""></el-option>
          <el-option label="未付款" :value="1"></el-option>
          <el-option label="交接中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
        </el-select>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <!--<el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column prop="order_number" label="订单号"></el-table-column>
        <el-table-column prop="title" label="公司名称" width="100" align="center"></el-table-column>
        <el-table-column prop="price" label="价格" width="100" align="center"></el-table-column>
        <el-table-column prop="realname" label="购买人"></el-table-column>
        <el-table-column prop="mobile" label="购买人电话"></el-table-column>
        <el-table-column prop="explor_name" label="出售人姓名"></el-table-column>
        <el-table-column prop="explor_phone" label="出售人电话"></el-table-column>
        <el-table-column prop="customer_name" label="专属客服"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status ==1" class="red">未付款</span>
            <span v-if="scope.row.status ==2">交接中</span>
            <span v-if="scope.row.status ==3">已完成</span>
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
            <el-button type="text" icon="el-icon-edit" @click="handleCustomer(scope.row)"
                       v-if="scope.row.customer_id == 0">添加客服
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row,2)" v-if="scope.row.status == 1">
              付款
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row,3)" v-if="scope.row.status == 2">
              完成
            </el-button>
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

    <!-- 编辑弹出框 -->
    <el-dialog title="请选择客服" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="50px">
        <el-form-item label="">
          <el-select v-model="form.customer_id" placeholder="请选择客服">
            <el-option
              v-for="item in optionsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "orders",
    data() {
      return {
        tableData: [],
        form: {
          name: '',
          date: '',
          address: ''
        },
        imgUrl: "",
        page: 1,
        size: 10,
        count: 0,
        keywords: '',
        keywords2: '',
        status: null,
        editVisible: false,
        optionsList: []
      }
    },
    created() {
      this.imgUrl = this.$imgurl;
      this.getData();
      this.getCustomer();
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
        if (this.keywords) {
          params.keywords = this.keywords
        }
        if (this.keywords2) {
          params.keywords2 = this.keywords2
        }
        if (this.status && this.status != null) {
          params.status = this.status
        }
        let rest = await this.$axios.OrdersList(params);
        let {code, result, msg} = rest;
        this.count = result.total;
        if (code == 200) {
          this.tableData = result.data;
        }
      },
      async getCustomer() {
        let params = {
          page_num: 1,
          page_limit: 1000
        };
        let rest = await this.$axios.getCustomers(params);
        let {code, result, msg} = rest;
        if (code == 200) {
          this.optionsList = result.data;
        }
      },
      handleEdit(item) {
        sessionStorage.setItem('taskMessage', JSON.stringify(item));
        this.$router.push({
          path: "/orderDetail",
          query: {
            modify: 1
          }
        });
      },
      handleStatus(item, status) {
        let title = '确定要改为已支付么？';
        if (status == 3) {
          let title = '确定要改为已完成么？';
        }
        this.$confirm(title, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            status: status,
            id: item.id
          }
          let rest = await this.$axios.setStatusOrders(params);
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
      async saveEdit(){
        if(!this.form.customer_id){
          this.$message.error('请选择客服');
          return false;
        }
        this.optionsList.forEach((item,key)=>{
          if(item.id == this.form.customer_id){
            this.form.customer_name = item.name
          }
        })
        let params = JSON.parse(JSON.stringify(this.form));
        let rest = await this.$axios.setCustomer(params);
        let {data, msg, code} = rest;
        if (code == 200) {
          this.editVisible = false;
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

      },
      handleCustomer(item) {
        this.form = {
          id: item.id,
          customer_id: '',
          customer_name: ''
        };
        this.editVisible = true;
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
          let rest = await this.$axios.deleteOrdersList({id: pictureId});
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
  .orders {
  }
</style>
