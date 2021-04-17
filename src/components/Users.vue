<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索于添加区 -->
      <!-- el-ui的栅格布局 一行分24分，:span控制分几份 :gutter控制间隙-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserByid(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="Top Center 分配角色" placement="top" :enterable="false" >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini" @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
      <!--添加用户的对话框  -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisibile"
      width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibile = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoledialogVisible" width="50%"
         @close="setRoledialogClose">
       <div>
         <p>当前用户：{{userInfo.username}}</p>
         <p>当前角色：{{userInfo.role_name}}</p>
         <p>分配新角色：
           <el-select v-model="selectedRoleId" placeholder="请选择">
             <el-option
               v-for="item in rolesList"
               :key="item.id"
               :label="item.roleName"
               :value="item.id">
             </el-option>
           </el-select>
         </p>
       </div>
       <span slot="footer" class="dialog-footer">
         <el-button @click="setRoledialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
       </span>
     </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证邮箱规则
    var checkEmail=(rule,value,cb)=>{
      //验证邮箱
      const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){ return cb()}
      cb(new Error('请输入合法的邮箱'));
    };
    //验证手机号规则
   var checkMobile=(rule,value,cb)=>{
     const regMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
     if(regMobile.test(value)){return cb()}
      cb(new Error('请输入合法的手机号'));
    };
    return {
      //已选中的角色ID值
      selectedRoleId:'',
      //所有角色的数据列表
      rolesList:[],
      //被分配角色的用户信息
      userInfo:{},
      //控制分配角色对话框的显示与隐藏
      setRoledialogVisible:false,
      //修改对话框查询的用户信息
      editForm:{},
      //控制修改用户对话框的显示与隐藏
      editDialogVisibile:false,
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      //控制添加用户对话框的显示和隐藏
      addDialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //修改界面表单的验证
      editFormRules:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail,trigger:"blur"}
          ],
        mobile:[
          { required: true, message: '请输入手机', trigger: 'blur' },
          {validator:checkMobile,trigger:"blur"}
          ]
      },
      //添加表单数据规则对象
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
         { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }],
         password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
         { min: 6, max: 10, message: '用户名长度在 6 到 10 个字符', trigger: 'blur' }
         ],
         email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
           {validator:checkEmail,trigger:'blur'}
         ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
           {validator:checkMobile,trigger:'blur'}
         ],
      }
    };
  },
  mounted() {
    this.getUersList();
  },
  methods: {
    getUersList() {
      this.axios.get("users", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取用户列表失败！");
        this.userList = res.data.data.users;
        // console.log(this.userList);
        this.total = res.data.data.total;
      });
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUersList();
    },
    //监听页码值改变
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUersList();
    },
    userStateChange(userinfo) {
      console.log(userinfo);
      this.axios
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          if (res.data.meta.status1 == 200) {
            //信息修改失败后，改回去
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error("更新用户失败");
          }
          this.$message.success("更新用户状态成功");
        });
    },
    //添加重置对话框关闭重置事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮添加新用户
    addUser(){
    this.$refs.addFormRef.validate(valid=>{
      // console.log(valid);
      if(!valid) return 
     // 如果通过添加新用户
      this.axios.post('users',this.addForm).then(res=>{
        console.log(res.data);
        if(res.data.meta.status!==201){
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        //隐藏添加用户的对话框
        this.addDialogVisible=false;
        //刷新用户列表
        this.getUersList();
      })
    })
    },
    //展示编辑用户的对话框
    showEditDialog(id){   
    this.editDialogVisibile=true;
    this.axios.get('users/'+id).then(res=>{
      if(res.data.meta.status!==200){
        return this.$message.error('查询用户信息失败');
      }
      this.editForm=res.data.data;
     
    })
    },
    //修改对话框关闭重置
    editDialogClose(){
      this.$refs.editFormRef.resetFields();
    },
    //修改信息并提交
    editUserInfo(){
      this.$refs.editFormRef.validate(valid=>{
      //校验不通过返回
      if(!valid) return
      //校验通过发起请求
      this.axios.put('users/'+this.editForm.id,`email=${this.editForm.email}&mobile=${this.editForm.mobile}`).then(res=>{
        if(res.data.meta.status!==200) return this.$message.error('更新失败');
        //更新成功后关闭对话框，刷新列表，提示修改成功
        this.editDialogVisibile=false;
        this.getUersList();
        this.$message.success('更新信息成功');
      })
      })
    },
    //根据ID删除用户信息
    removeUserByid(id){
      //弹框询问是否删除
       this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!'  //如果确认删除，结果为confirm
          });  
          if(res==='confirm'){
            this.axios.delete('users/'+id).then(res=>{
              if(res.data.meta.sstus11==200) return this.$message.error('删除失败');
              this.$message.success('删除成功');
              this.getUersList();//删除成功后刷列表

            })
          }    
          }).catch((res) => {
          this.$message({
            type: 'info',
            message: '已取消删除'  //如果取消删除，结构为cancel          
          })         
        })
    },
    //展示分配角色的对话框
    setRole(userInfo){
      //在展示对话框之前获取所有用户列表
      this.axios.get('roles').then(res=>{
        if(res.data.meta.status!=200) return this.$message.error('获取角色列表失败');
        this.rolesList=res.data.data;
      })
      //显示所在用户的信息
      this.userInfo=userInfo;
      this.setRoledialogVisible=true;
    },
    //点击按钮分配角色
    saveRoleInfo(){
      //如果没有选择要提示用户进行选择
      if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色'); 
      this.axios.put(`users/${this.userInfo.id}/role`,`rid=${this.selectedRoleId}`).then(res=>{
        if(res.data.meta.status!==200) return this.$message.error('更新用户信息失败')
        this.$message.success('更新用户信息成功');
        this.getUersList();
        this.setRoledialogVisible=false;
      })
    },
    //分配角色对话框关闭事件
    setRoledialogClose(){
      this.selectedRoleId='';
      // this.userInfo='';
    }
 }
}
</script>
<style scoped>
</style>