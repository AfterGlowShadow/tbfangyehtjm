<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<style lang="scss">
  @import "../static/css/main.css";
  @import "../static/css/color-dark.css"; /*深色主题*/
  /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/

  .tree_node_op {
    float: right;
    height: 20px;
    width: 100%;
    text-align: right;
    display: none;
  }

  .handle-box {
    margin-bottom: 10px;
  }

  .red {
    color: #f00;
  }

 .handle-box{
   .el-input {
     width: 250px;
   }
 }

  .slider {
    .container {
      .el-upload {
        width: 610px !important;

        .el-upload-dragger {
          width: 100%;
        }
      }

      .avatar {
        height: 100%;
        max-width: 100%;
      }
    }
  }
  .avatar {
    height: 100%;
    max-width: 100%;
  }
  .avatar_img{
    max-width: 150px;
  }
  .thumb_img{
    max-width: 80px;
    max-height: 80px;
  }
</style>
