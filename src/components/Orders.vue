<template>
  <div>
     <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>订单管理</el-breadcrumb-item>
     <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片视图 -->
   <el-card>
     <el-row>
       <el-col :span="8">
          <el-input placeholder="请输入内容" >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
       </el-col>
     </el-row>
     <!-- 订单列表数据 -->
     <el-table :data="orderList" border stripe>
       <el-table-column type="index"></el-table-column>
       <el-table-column label="订单编号" prop="order_number"></el-table-column>
       <el-table-column label="订单价格" prop="order_price"></el-table-column>
       <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
         </template>
       </el-table-column>
       <el-table-column label="是否发货" prop="is_send"></el-table-column>
       <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time|dataFormat}}
         </template>
       </el-table-column>
       <el-table-column label="操作" >
         <template slot-scope="">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showprogressBox"></el-button>
         </template>
       </el-table-column>
     </el-table>
     <!-- 分页区域 -->
     <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :total="total"
      :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" status-icon :rules="addressFormRules" ref="addressFormRefs" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="cityOptions"> 
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.ddress2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%" @close="progressDialogClosed">
    </el-dialog>
   </el-card>
  </div>
</template>
<style scoped>
.el-cascader{width:100%}
</style>
<script>
// 导入城市数据
import cityData from './citydata.js' 

export default {
  data(){
    return {
      //物流信息内容数组
      progressInfo:[],
      //物流进度对话框的显示与隐藏
      progressVisible:false,
      //级联选择器的配置选项
      cityOptions:{
        expandTrigger: 'hover' 
      },
      //地址表单信息对象
      addressForm:{
        address1:[],
        addrsss2:''
      },
      //表单验证规则
      addressFormRules:{
        address1:[
            { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2:[
            { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData:cityData,
      //对话框关闭与否
      addressVisible:false,
      //获取订单信息的参数
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      //总数据条数默认为零
      total:0,
      //订单列表信息
      orderList:[]
    }
  },
  mounted(){
    this.getOrderList();
  },
  methods:{
    getOrderList(){
      this.axios.get('orders',{params:this.queryInfo}).then(res=>{
        let {data,meta}=res.data;
        if(meta.status!==200) return this.$message.error('获取订单列表失败');
        this.total=data.total;
        this.orderList=data.goods;
      }).catch(res=>{
        console.log(res);
      })
    },
    handleSizeChange(newsize){
      this.queryInfo.pagesize=newsize;
      this.getOrderList();
    },
    handleCurrentChange(newnum){
      this.queryInfo.pagenum=newnum;
      this.getOrderList();
    },
    //展示修改地址对话框
    showBox(){
      this.addressVisible=true
    },
    //对话框关闭事件
    addressDialogClosed(){
       //对话框关闭情况对话框
      this.$refs.addressFormRefs.resetFields();
    },
    //显示物流进度对话框
    showprogressBox(){
      // 查询物流信息功能有bug
      // this.axios.get('/kuaidi/804909574412544580').then(res=>{
      //   let {data,meta}=res.data;
      //   if(meta.status!==200) return this.$message.error('获取物流信息失败');
      //   this.progressInfo=data;
      //   console.log(this.progressInfo);
      // }).catch(res=>{
      //   console.log(res);
      // })
      this.progressVisible=true
    },
    //关闭物流进度对话框
    progressDialogClosed(){
      this.progressVisible=false
    }
  }
}
</script>