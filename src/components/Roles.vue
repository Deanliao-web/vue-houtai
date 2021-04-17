<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
     <el-card >
       <!-- 添加角色按钮 -->
       <el-row>
         <el-col><el-button type="primary">添加角色</el-button></el-col>
       </el-row>
       <!-- 角色列表区域 -->
       <el-table :data="roleList" border stripe>
         <!-- 展开行部分 -->
         <el-table-column type="expand">
           <template slot-scope="scope">             
             <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item,i1) in scope.row.children" :key="item.id">
               <!-- 渲染一级权限 -->
               <el-col :span="5">
                 <el-tag type="primary" closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
               </el-col>
               <!-- 渲染二级和三级权限 -->               
               <el-col :span="19">
                 <!-- 渲染二级权限 -->
                 <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item.children" :key="item2.id">                   
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>       
                   <!-- 渲染三级权限 -->
                   <el-col :span="18">
                     <el-tag  v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable
                     @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                     </el-tag>
                   </el-col>
                 </el-row>                
               </el-col>            
             </el-row>                                                
           </template> 
         </el-table-column>   
         <!-- 列表内容部分 -->
         <el-table-column type="index"></el-table-column>
         <el-table-column label="角色名称" prop="roleName"></el-table-column>
         <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
         <el-table-column label="操作">  
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
             <el-button type="warning" icon="el-icon-setting" size="mini"
             @click="showSetRightDialog(scope.row)"
             >分配权限</el-button>
           </template>
         </el-table-column>        
       </el-table>
     </el-card>
     <!-- 分配权限对话框 -->
     <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" width="50%"  @close="SetRightDialogClosed()">
      <!-- 树形控件 -->
       <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id"
       :default-checked-keys="defKeys" ref="treeRef"
       ></el-tree>
       <span slot="footer" class="dialog-footer">
         <el-button @click="SetRightDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="allotRights">确 定</el-button>
       </span>
     </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return {
      //所有角色列表数据
      roleList:[],
    //控制分配权限对话框的显示和隐藏
      SetRightDialogVisible:false,
      //所有权限的数据
      rightsList:[],
      //树形控件的属性对象
      treeProps:{
        children:'children',
        label:'authName'
      },
      //默认选中的数组ID值
      defKeys:[],
      //当前即将分配权限的角色id
      roleId:''
    }
  },
  mounted(){
    this.getRolesList();
  },
  methods:{
    //获取所有角色列表
    getRolesList(){
      this.axios.get('roles').then(res=>{
          if(res.data.meta.status!==200) return this.$message.error('获取信息失败')
          this.roleList=res.data.data;
          // console.log(res.data.data);
      });
    },
    //根据ID删除对应的权限
    removeRightById(role,rightId){
      //弹框提示用户是否要删除
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          // console.log('执行删除操作');
          this.axios.delete(`roles/${role.id}/rights/${rightId}`).then(res=>{
            // console.log(res.data);
            //删除失败提示信息
            if(res.data.meta.status!==200) return this.$message.error('删除权限失败');
            //删除成功刷新列表
            this.$message.success('删除权限成功');
            role.children=res.data.data;
          })
          
        }).catch(()=>{
          this.$message({type: 'info', message: '已取消删除'})
        })
    },
    //展示分配权限对话框
    showSetRightDialog(role){
      this.roleId=role.id;
      //获取所有权限数据
      this.axios.get('rights/tree').then(res=>{
          if(res.data.meta.status!==200) return this.$message.error('获取权限数据失败');
          //获取的权限数据保存到变量中
          this.rightsList=res.data.data; 
          console.log(res.data.data);
      });
      //递归获取三级节点的id
      this. getLefKeys(role,this.defKeys)
      //打开分配权限对话框
      this.SetRightDialogVisible=true;
    },
    //通过递归的形式获取每个角色下所有三级权限的id
    getLefKeys(node,arr){
      //如果当前节点不包含children属性，则是三级节点
      if(!node.children) return arr.push(node.id)
      //如果当前节点包含children,则使用递归找到三级节点  
      node.children.forEach(elem =>this.getLefKeys(elem,arr));             
    },
    //监听分配权限对话框的关闭事件
    SetRightDialogClosed(){
      this.defKeys=[];
    },
    //为角色分配权限
    allotRights(){
      //将选中项的id数组，打散为单独的元素，放入到新数组中
      const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
      // console.log(keys);
      const idStr=keys.join(',');
      this.axios.post(`/roles/${this.roleId}/rights`,`rids=${idStr}`).then(res=>{
        if(res.data.meta.status!==200) return this.$message.error('分配权限失败');
        this.$message.success('分配权限成功')
        //分配成功后刷新列表
        this.getRolesList();
        //分配成功后关闭对话框
        this.SetRightDialogVisible=false;
      })
    }
  }
}
</script>
<style scoped>
.el-tag{
  margin:7px;
}
.bdtop{
  border-top:1px solid #dee;
}
.bdbottom{
  border-bottom:1px solid #dee;
}
.vcenter{
  display:flex;align-items:center;
}
</style>