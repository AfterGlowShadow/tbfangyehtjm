<template>
  <div class="list">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-home"></i> 商品管理</el-breadcrumb-item>
        <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/GoodsAdd')" >添加商品</el-button>
      </div>
      <!--default-expand-all-->
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        lazy
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="goodsname" label="商品名称"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="classifyname" label="分类"></el-table-column>
        <el-table-column prop="price" label="展示价格"></el-table-column>
        <el-table-column prop="create_time" label="添加时间"></el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="$router.push('/GoodsAdd?id='+scope.row.id)">修改</el-button>
            <el-button type="text" icon="el-icon-edit"  @click="delItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        let rest = await this.$axios.GoodDetails();
        let {code, result, msg} = rest;
        if (code == 200) {
          this.tableData = result.data
        } else {
          this.$message.error(msg);
        }
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
          let rest = await this.$axios.deleteGoodDetails(param);
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
