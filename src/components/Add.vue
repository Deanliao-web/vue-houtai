<template>
  <div>
 <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>添加商品</el-breadcrumb-item>
   </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon  :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <!-- el-steps和el-tabs使用同一个activeIndex实现联动，利用"-"隐式转换将其转为数值型 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRefs" label-position="top" >
       <!-- v-model指定激活的是哪个选项，将name属性的值保存到activeIndex上 -->
       <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
         <el-tab-pane label="基本信息" name="0">
            <!-- prop 属性执行需要验证的属性（字段） -->
           <el-form-item label="商品名称" prop="goods_name">
             <el-input v-model="addForm.goods_name" ></el-input>
           </el-form-item>
           <el-form-item label="商品价格" prop="goods_price" >
             <el-input v-model="addForm.goods_price" type="number"></el-input>
           </el-form-item>
           <el-form-item label="商品重量" prop="goods_weight">
             <el-input v-model="addForm.goods_weight" type="number"></el-input>
           </el-form-item>
           <el-form-item label="商品数量" prop="goods_number">
             <el-input v-model="addForm.goods_number" type="number"></el-input>
           </el-form-item>
           <el-form-item label="商品分类" prop="goods_cat">
             <!-- 级联选择器 options指定数据源 props配置项对象 v-model选中内容时对应生成的id值是一个数组代表选中项的各个id-->
            <el-cascader v-model="addForm.goods_cat" :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
           </el-form-item>        
         </el-tab-pane>
         <el-tab-pane label="商品参数" name="1">
           <!-- 渲染表单参数项 -->
           <el-form-item :label="item.attr_name" v-for="(item) in this.manyTableData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" 
              :key="i"></el-checkbox>
            </el-checkbox-group>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品属性" name="2">
           <el-form-item :label="item.attr_name" v-for="(item) in this.onlyTableData" :key="item.attr_id">
             <el-input v-model="item.attr_vals"></el-input>
           </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品图片" name="3">
           <!-- action是图片要上传到的后台地址是完整的绝对路径地址 -->
           <!-- handlePreview处理图片预览效果的函数 -->
           <!-- handleRemove处理图片删除的函数 -->
          <el-upload :action="uploadURL" :headers="headersObj"
            :on-preview="handlePreview" :on-remove="handleRemove"           
            list-type="picture" :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
         </el-tab-pane>
         <el-tab-pane label="商品内容" name="4">
           <!-- 富文本编辑器 -->
           <!--富文本编辑器中的内容使用v-model绑定到相应属性中，会自动同步  -->
           <quill-editor v-model="addForm.goods_introduce"></quill-editor>
           <!-- 添加商品按钮 -->
           <el-button class="btnAdd" type="primary" @click="add">添加商品</el-button>
         </el-tab-pane>
       </el-tabs>
     </el-form>
  </el-card>
  <!-- 图片预览对话框 -->
  <el-dialog
  title="图片预览" :visible.sync="previewVisible" width="50%">
  <!-- 图片预览的地址为服务器上的绝对地址，通过handlePreview函数传递到previewPath上 -->
  <img :src="previewPath" class="previewImg">
</el-dialog>
  </div>
</template>
<style scoped>
.el-checkbox{
  margin:0 5px 0 0 !important;
}
/* 让预览的图片宽度占满 */
.previewImg{
  width:100%
}
.btnAdd{
  margin-top:15px;
}
</style>
<script>

export default {
  data(){
    return {
      previewVisible:false,
      //图片预览的地址
      previewPath:'',
      //图片上传组件的请求头对象
      headersObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      //上传图片的地址
      uploadURL:"http://127.0.0.1:8888/api/private/v1/upload",
      //商品属性列表数据
      onlyTableData:[],
      //动态参数列表数据
      manyTableData:[],
      //级联选择器的配置项
      cateProps:{
        expandTrigger: 'hover',
        //看到的内容对应数据源中的属性名
        label:'cat_name',
        //选中内容时对应数据源中的id属名       
         value:'cat_id',
        //子节点属性
        children:'children'
      },
      //商品分类列表
      cateList:[],
      //el-steps和el-tabs共同绑定的激活变量
      activeIndex:'0',
      //表单数据对象
      addForm:{
        goods_name:"",
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        //商品分类数组
        goods_cat:'',
        //图片信息数组
        pics:[],
        //商品详情
        goods_introduce:'',
        attrs:[]
      },
      //表单验证规则对象
      addFormRules:{
        goods_name:[
            { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price:[
            { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight:[
            { required: true, message: '请输入商品重量', trigger: 'blur' }          
        ],
        goods_number:[
            { required: true, message: '请输入商品数量', trigger: 'blur' }             
        ],
        goods_cat:[
            { required: true, message: '请输入商品分类', trigger: 'blur' }            
        ]
      }
    }
  },
  mounted(){
    this.getCateList();
  },
  methods:{
    //获取所有商品分类数据
    getCateList(){
      this.axios.get('categories').then(res=>{
        let {data,meta}=res.data;
        if(meta.status!==200) return this.$message.error('获取商品信息失败');
        this.cateList=data;
        console.log(this.cateList)
      })
    },
    //级联选择器变化时触发函数
    handleChange(){
      //限制级联选择框只能选中三级参数
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat=[]
      }
    },
    //阻止页面跳转
    beforeTabLeave(activeName, oldActiveName){
      if(this.addForm.goods_cat.length<3){
        this.$message.error('商品分类必须为三级');
        return false
      }else if(this.addForm.goods_cat.length==0){
        this.$message.error('商品分类不能为空');
        return false
      }
    },
    //切换面板时进行的操作
    tabClicked(){
      //activeIndex为"1"访问的是商品参数面板
      if(this.activeIndex==='1'){
      this.axios.get(`categories/${this.cateId}/attributes`,{params:{sel:"many"}}).then(res=>{
        let {data,meta}=res.data;
        if(meta.status!==200) return this.$message.error('获取参数列表失败');
        data.forEach(item=>{
          item.attr_vals=item.attr_vals==""?'':item.attr_vals.split(' ')
        })
        console.log(data);
        this.manyTableData=data;        
      })
      }else if(this.activeIndex==='2'){
       this.axios.get(`categories/${this.cateId}/attributes`,{params:{sel:"only"}}).then(res=>{
         let {data,meta}=res.data;
         if(meta.status!==200) return this.$message.error('获取商品属性失败');
        //  console.log(data);
        this.onlyTableData=data;
       }) 
      }
    },
    //处理图片预览效果的函数
    handlePreview(file){
      this.previewPath=file.response.data.url;
      //打开图片预览对话框
      this.previewVisible=true
    },
    //处理图片移除的函数
    handleRemove(file){
     //1获取要删除的图片路径
     let filepath=file.response.data.tmp_path;
     //2根据图片路径在pics数组中找到对应的索引值
     let index=this.addForm.pics.findIndex(x=>x.pic===filepath);
     //3根据索引值删除对应的图片信息
     this.addForm.pics.splice(index,1);
     console.log(this.addForm);
    },
    //上传成功触发此函数
    handleSuccess(res){
     //1通过拼接得到图片信息对象
     //2将图片信息加入到pics数组中
     let picsInfo={pic:res.data.tmp_path};
     this.addForm.pics.push(picsInfo);
     console.log(this.addForm);
    },
    add(){
      //表单自带的validate函数，只要调用就进行验证,验证结果通过回调函数的形参进行接收（true/false）
      this.$refs.addFormRefs.validate(valid=>{
        //验证失败进行提示
        if(!valid) return this.$message.error('填写必要的表单项');
        //验证成功提交信息,将对应的数组装换成字符串
        //但是级联选择器需要数组，则相互矛盾。
        //使用lodash深克隆，复制addForm,实现互不影响
        let form = _.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(',');
        //处理动态参数
        this.manyTableData.forEach(item=>{
          let newInfo={
            attr_id:item.attr_id,
            attr_vals:item.attr_vals.join('')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item=>{
          let newInfo={
            attr_id:item.attr_id,
            attr_vals:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
       //使用form进行数据的提交，但是form里没有attrs,进行创建赋值
       form.attrs=this.addForm.attrs;
      //发送请求添加商品，商品名称是惟一的
      this.axios.post('goods',form).then(res=>{
        let {data,meta}=res.data;
        if(meta.status!==201) return this.$message.error('添加商品失败');
         this.$message.success('添加商品成功');
         this.$router.push('/goods');
      })
      })
    }
  },
  computed:{
    //商品id的计算属性
    cateId(){
      if(this.addForm.goods_cat.length==3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>