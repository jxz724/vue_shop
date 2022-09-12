<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div class="left">
        <img src="" alt="">
        <i class="el-icon-menu" @click="isFold"></i>
        <span>通用后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边菜单栏区 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          router
          default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          >
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id"
            >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item
                :index=" '/' + subItem.path + ''"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path + '')"
                >
                <template slot="title" >
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const {data: res} = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    isFold () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scope>
.el-container{
  height:100%;
  .el-menu{
    border-right:none;
  }
  }
.el-header{
  background-color: rgb(40, 41, 41);
  display:flex;
  justify-content: space-between;
  align-items: center;
  .left{
    display: flex;
    align-items: center;
    i{
      color:#fff;
      margin-left:10px;
      cursor:pointer;
    }
    img{
      width:40px;
      height:40px;
      border:1px solid #fff;
    }
    span{
      margin-left:10px;
      color:#fff;
    }
  }
}
.el-aside{
  background-color:rgb(47, 49, 49)
}
</style>
