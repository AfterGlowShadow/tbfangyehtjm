<template>
    <div class="details">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-lx-home"></i> 用户管理</el-breadcrumb-item>
          <el-breadcrumb-item> {{$route.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
</template>

<script>
    export default {
        name: "details"
    }
</script>

<style scoped lang="scss">
    .details {
    }
</style>
