<template>
  <div class="login_content">
    <div class="login_box"></div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login_content{
  background-color: #2b4b6b;
  height:100%;
}
.login_box{
  width:450px;
  height:300px;
  background-color: #fff;
  border-radius: 3px;
  position:absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
}
</style>
