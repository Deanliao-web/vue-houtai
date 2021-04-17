<template>
  <div>
   <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>商品分类</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片视图区域 -->
   <el-card>
     <el-row>
       <el-col><el-button type="primary" @click="showAddCateDialog">添加分类</el-button></el-col>
     </el-row>     
     <!-- 表格区域 -->
     <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false"
     :expand-type="false" show-index index-text="#" border :show-row-hover="false">
      <!-- 是否有效 -->
     <template slot="isok" slot-scope="scope">
       <i class="el-icon-success" style="color:green"
       v-if="scope.row.cat_deleted===false"></i>
       <i class="el-icon-error" style="color:red" v-else></i>
     </template>
     <!-- 排序 -->
     <template slot="order" slot-scope="scope">
       <el-tag size="mini" type="primary" v-if="scope.row.cat_level===0"
       >一级</el-tag>
       <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
       <el-tag size="mini" type="warning" v-else>三级</el-tag>
     </template>
     <!-- 操作 -->
     <template slot="opt" slot-scope=""> 
       <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
       <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
     </template>
     </tree-table>
     <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[3, 4, 5,10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
   </el-card>
   <!-- 添加分类的对话框 -->
   <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"
   @close="addCateDialogClosed">
     <!-- 添加分类的表单 -->
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
    <el-form-item label="分类名称：" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类：">
      <!-- options用来指定数据源 -->
      <!-- props用来指定配置对象 -->
     <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
       @change="parentCateChange" clearable>
     </el-cascader>
    </el-form-item>  
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return {
      //选中的父级分类数组，只是父级分类信息
      selectedKeys:[],
      //级联选择器的配置对象
      cascaderProps:{
        checkStrictly:'true',
        expandTrigger: 'hover' ,
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //父级分类的列表
      parentCateList:[],
      //添加分类表单的验证规则
      addCateFormRules:{
        cat_name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      //添加分类的表单数据对象
      addCateForm:{
        //分类名称
          cat_name:"",
        //父级分类id
          cat_pid:0,
          //分类等级，默认为一级分类
          cat_level:0
        },
      //控制添加分类对话框的显示
      addCateDialogVisible:false,
      //为table指定列的定义
      columns:[{
        label:'分类名称',
        prop:'cat_name'
      },
      {
        label:'是否有效',
        //指定当前列为自定义模板列
        type:'template',
        //表示这一列使用的模板名称
        template:'isok'
      },
      {
        label:'排序',
        //指定当前列为自定义模板列
        type:'template',
        //表示这一列使用的模板名称
        template:'order'
      },
      {
        label:'操作',
        //指定当前列为自定义模板列
        type:'template',
        //表示这一列使用的模板名称
        template:'opt'
      }
      ],
      //指定查询条件
      queryinfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      //商品分类的数据列表
      cateList:[],
      //总数据条数
      total:0
    }
},
  mounted(){
    this.getCateList();
  },
  methods:{
    //获取商品分类数据
    getCateList(){
      this.axios.get('categories',{params:this.queryinfo}).then(res=>{
        if(res.data.meta.status!==200) return this.$message.error('获取商品分类失败');
        //将数据列表赋值给对应的变量
        this.cateList=res.data.data.result;
        //将总数据条数赋值给对应变量
        this.total=res.data.data.total;
      })
    },
    //每页显示条目个数page-size改变时触发
    handleSizeChange(newSize){
      this.queryinfo.pagesize=newSize;
      //赋值后刷新列表
      this.getCateList();
    },
    //当前页数pagenum改变时触发
    handleCurrentChange(newPage){
     this.queryinfo.pagenum=newPage;
     //赋值后刷新列表
     this.getCateList();     
    },
    //点击按钮显示添加分类的对话框
    showAddCateDialog(){
      //先获取父元素数据列表
       this.getParentCateList();
       //再弹出对话框
      this.addCateDialogVisible=true;
     
    },
    //获取父级分类的数据列表
    getParentCateList(){
      //type=2表示返回前两级，一级和二级的分类数据
      this.axios.get('categories',{params:{type:2}}).then(res=>{
        if(res.data.meta.status!==200) return this.$message.error('获取腹肌分类失败');
        //解构数据
        let {data,meta}=res.data;       
        this.parentCateList=data;
        // console.log(this.parentCateList);
      })
    },
    //选择项发生变化时触发
    parentCateChange(){
      //  console.log(this.selectedKeys);
    //如果selectedKeys的长度大于0，证明选中了父级分类，反之没有选中父级分类
    if(this.selectedKeys.length>0){
    //要添加的分类的父级id是数组的最后一项
      this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1];
    //selectedKeys数组的长度对应cat_level等级的数值
      this.addCateForm.cat_level=this.selectedKeys.length; 
      return 
    }else{
      //父级分类的ID
      this.addCateForm.cat_pid=0;
      //为当前分类的等级赋值
      this.addCateForm.cat_level=0;
    }   
    },
    //点击按钮添加新的分类
    addCate(){
      //调用表单的验证规则进行验证
      this.$refs.addCateFormRef.validate(validate=>{
        if(!validate) return
        this.axios.post('categories',this.addCateForm).then(res=>{
          if(res.data.meta.status!==201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功');
          //添加成功后刷新列表
          this.getCateList();
          //关闭对话框
          this.addCateDialogVisible=false;
        })
      })
      // console.log(this.addCateForm);
    },
    //监听对话框的关闭事件，重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys=[];
      this.addCateForm.cat_level=0;
      this.addCateForm.cat_pid=0;

    }
  }
}
</script>
<style scoped>
.treeTable{margin-top:15px;}
.el-cascader{width:100%;}
</style>