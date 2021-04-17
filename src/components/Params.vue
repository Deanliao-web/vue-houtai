<template>
  <div>
       <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>参数列表</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片视图区域 -->
   <el-card>
     <!-- 头部的警告区域 -->
    <el-alert title="注意:只允许为第三级分类设置相关参数！" type="warning" 
    show-icon :closable="false">
    </el-alert>
    <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
    <el-col>
      <span>选择商品分类</span>
      <!-- 选择商品分类的级联选择框 -->
      <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps"
        @change="handleChange"></el-cascader>
    </el-col>
    </el-row>
    <!-- tabs标签页 name表示选项卡对应的名称变量 v-model绑定选项卡名称变量对应name label是选项卡的标题-->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type='primary' size="mini" :disabled="isBtnDisable"
        @click="adddialogVisible=true">添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table :data="manyTableData" border :stripe="true">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <!-- 作用域插槽获取对应行的数据 -->
            <template slot-scope="scope">
              <!-- v-for循环数组数据变量，显示对应的内容 -->
              <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true" @close="handleClose(i,scope.row)">
                {{item}}
              </el-tag>
              <!-- 输入文本框 -->
              <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
              </el-input>
              <!-- 添加按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
           <!-- 用作用域插槽接收数据 -->
           <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" 
            @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" 
            @click="removeParams(scope.row.attr_id)">删除 </el-button>
           </template>
          </el-table-column>          
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type='primary' size="mini" :disabled="isBtnDisable"
        @click="adddialogVisible=true">添加属性</el-button>
        <!-- 静态属性表格 -->
        <el-table :data="onlyTableData" border :stripe="true">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <!-- 作用域插槽获取对应行的数据 -->
            <template slot-scope="scope">
              <!-- v-for循环数组数据变量，显示对应的内容 -->
              <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" :closable="true" @close="handleClose(i,scope.row)">
                {{item}}
              </el-tag>
              <!-- 输入文本框 -->
              <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
              </el-input>
              <!-- 添加按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
           <!-- 用作用域插槽接收数据 -->
           <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" 
            @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"
            @click="removeParams(scope.row.attr_id)" >删除 </el-button>
           </template>
          </el-table-column>          
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <!--添加参数的对话框  -->
  <el-dialog :title="'添加'+titleText" :visible.sync="adddialogVisible"
   width="50%" @close="adddialogClosed">
    <!-- 添加参数的对话框 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="addForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="adddialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addParams">确 定</el-button>
    </span>
  </el-dialog>

    <!-- 修改参数的对话框 -->
  <el-dialog :title="'修改'+titleText" :visible.sync="editialogVisible"
   width="50%" @close="editialogClosed">
    <!-- 添加参数的对话框 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="editForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editParams">确 定</el-button>
    </span>
  </el-dialog>    
  </div>
</template>
<script>
export default {
  data(){
    return {
    //修改参数表单的验证规则对象       
    editFormRules:{
      attr_name:[
         {required:true,message:'请输入参数名称',trigger:'blur'}
      ]      
    },
    //修改参数的表单数据对象  
    editForm:{},
    //控制修改对话框的显示与隐藏
    editialogVisible:false,
    //添加表单的验证规则对象
    addFormRules:{
      attr_name:[
         {required:true,message:'请输入参数名称',trigger:'blur'}
      ]
    },
    //添加参数的表单数据对象
    addForm:{}, 
    //控制添加对话框的显示的隐藏
    adddialogVisible:false,
    //静态属性的数据列表  
    onlyTableData:[],
    //动态属性的数据列表
    manyTableData:[],
    //被激活的标签页名称
    activeName:'many',
    //商品分类列表
    cateList:[],
    //商品分类级联选择框的配置信息对象
    cateProps:{
      expandTrigger: 'hover',
      value:'cat_id',
      label:'cat_name',
      children:'children'
      },
    //级联选择框双向绑定的数组
    selectedCateKeys:[]
    }
  },
  mounted(){
    this.getCateList()
  },
  methods:{
    //获取所有的商品分类列表
    getCateList(){
      this.axios.get('categories').then(res=>{
        let {data,meta}=res.data;
        if(meta.status!==200) return this.$message.error('获取商品分类失败');
        this.cateList=data;
        // console.log(this.cateList);
      })
    },
    //级联选择框选中项变化会触发此函数
    handleChange(){
      this.getParamsList();
      
    },
    //tab标签页点击切换的事件处理函数
    handleTabClick(){
      console.log(this.activeName);
      this.getParamsList();
    },
    //获取参数列表数据的操作
    getParamsList(){
      //判断选中的内容是否是三级分类
      if(this.selectedCateKeys.length!==3){
        this.selectedCateKeys=[];
        this.manyTableData=[];
        this.onlyTableData=[]
      }else{
        // console.log(this.selectedCateKeys);
      }
      //根据所选分类的id和当前所处的面板，获取对应的参数
      this.axios.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      .then(res=>{
       let {data,meta}=res.data;
       if(meta.status!==200) return this.$message.error('获取参数列表失败');
       this.$message.success('获取参数列表成功');

       data.forEach(item => {
         //将attr_vals转成数组
         //判断原attr_id中是否有内容，如果有内容，用空格分隔。如果没内容直接赋值空数组
         item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[];
         //控制文本框的显示与隐藏
         item.inputVisible=false;
         //文本框中输入的值
         item.inputValue='';

       });
       console.log(data);
       if(this.activeName==="many"){this.manyTableData=data}
       else{this.onlyTableData=data}
     })
     },
    //添加对话框的关闭事件
    adddialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮添加参数
    addParams(){
      this.$refs.addFormRef.validate(valid=>{
        //验证失败的原因？
        if(!valid) return
        this.axios.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,//添加参数的名称
          attr_sel:this.activeName//添加参数的类别
        }).then(res=>{
          let {data,meta}=res.data;
          if(meta.status!==201) return this.$message.error('添加参数失败');
          this.$message.success('添加参数成功');
          this.adddialogVisible=false;
          this.getParamsList();
        })
      })
    },
    //点击按钮展示修改对话框
    showEditDialog(attr_id){
      this.editialogVisible=true;
      //查询当前行参数的信息
      this.axios.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{attr_sel:this.activeName}
        }).then(res=>{
          let {data,meta}=res.data;
          if(meta.status!==200) return this.$message.error('获取参数信息失败');
          this.editForm=data;
        })
    },
    //关闭对话框的函数
    editialogClosed(){
     //重置表单内容
      this.$refs.editFormRef.resetFields()
    },
    //点击按钮修改参数
    editParams(){
      this.$refs.editFormRef.validate(valid=>{
       //验证失败，返回
       //valid表示是否校验成功，是一个布尔值
       if(!valid) return
       this.axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
       {
         attr_name:this.editForm.attr_name,
         attr_sel:this.activeName
         }).then(res=>{
           let {data,meta}=res.data;
           if(meta.status!==200) return this.$message.error('修改失败');
           this.$message.success('修改成功');
           //修改成功后刷新参数列表
           this.getParamsList();
           //修改成功后关闭修改参数对话框
           this.editialogVisible=false;
         })
      })
    },
    //根据id删除对应的参数项
    removeParams(attr_id){
      //确认结果有两种confirm和cancel
      //如果取消，用catch捕获错误并且return出去
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(res=>{
     //没有取消走删除的业务逻辑
      this.axios.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      .then(res=>{
        let {data,meta}=res.data;
        // console.log(res.data);
        if(meta.status!==200) return this.$message.error('删除失败');
        this.$message.success('删除成功');
        this.getParamsList();
      });
    })
    .catch(err=>{
      //用户取消删除操作
      if(err!=='confirm') return this.$message.info('已取消删除');
    })
    },
    //文本框失去焦点或按下enter键触发事件
   handleInputConfirm(row){
    //  console.log('ok');
    //如果输入的内容为空，则清空
    if(row.inputValue.trim().length===0){
      row.inputValue='';
      row.inputVisible=false;
      return
    }
    //如果没有return，说明输入的内容正确需要进行修改
    row.attr_vals.push(row.inputValue.trim());
    row.inputValue='';
    row.inputVisible=false;
    //发请求保存数据
    this.saveAttrVals(row);
   },
   //将对attr_vals的操作保存的数据库
   saveAttrVals(row){
    this.axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
      attr_name:row.attr_name,
      attr_sel:row.attr_sel,
      attr_vals:row.attr_vals.join(' ')
    }).then(res=>{
      let {data,meta} =res.data;
      if(meta.status!==200) return this.$message.error('修改数据失败');
      this.$message.success('修改数据成功!');
    })
   },
   //点击按钮显示文本输入框
   showInput(row){
     row.inputVisible=true;
     //文本框自动获得焦点
     //$nextTick当页面上元素被重新渲染后才会执行回调函数
     this.$nextTick(_ => {
       this.$refs.saveTagInput.$refs.input.focus();
     });
   },
   //删除对应的参数可选项
   handleClose(i,row){
     row.attr_vals.splice(i,1);
    this.saveAttrVals(row);
   }
  },
  computed:{
    //如果按钮需要被禁用返回true,如果不需要返回false
    isBtnDisable(){
      if(this.selectedCateKeys.length!==3){
        return true
      }
        return false
    },
    //当前选中的三级分类的ID
    cateId(){
      if(this.selectedCateKeys.length===3){
        return this.selectedCateKeys[2]
      }
        return null
    },
    //动态计算标题名称
    titleText(){
      if(this.activeName==="many") return '动态参数'
      return '静态属性'
    }
  }
}
</script>
<style scoped>
.cat_opt{margin:15px 0px;}
.el-tag{margin:5px;}
.input-new-tag{width:150px;}
</style>