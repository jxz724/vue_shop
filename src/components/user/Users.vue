<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table
        :data="userList"
        border
        style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scop">
            <el-switch v-model="scop.row.mg_state" @change="userStateChange(scop.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scop">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scop.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scop.row.id)"></el-button>
            <!-- 设置按钮 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClose">
        <el-form :model="ruleForm" :rules="rules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="rules" label-width="70px"
          ref="editFormRef">
          <el-form-item label="用户名" >
            <el-input v-model="editForm.username" disabled> </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    // 手机号验证
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以我就在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value.trim())) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    /** * 邮箱校验* */
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value.trim())) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      editForm: {},
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {validator: checkPhone, trigger: 'blur'}
        ]}
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.axios.get('users', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('请求信息失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log('1234', res)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    async userStateChange (userInfo) {
      const { data: res } = await this.axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return ('验证失败')
        const {data: res} = await this.axios.post('users', this.ruleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog (id) {
      const {data: res} = await this.axios.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return ('验证失败')
        const {data: res} = await this.axios.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功')
      })
    },
    removeUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: res} = await this.axios.delete(`users/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.getUserList()
        this.$message.success('删除用户成功！')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less" scope>
</style>
