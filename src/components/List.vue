<template>
  <div>
       <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>商品管理</el-breadcrumb-item>
     <el-breadcrumb-item>商品列表</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片视图区域 -->
   <el-card>
     <el-row :gutter="20">
       <el-col :span="8" >
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
       </el-col>
       <el-col :span="4">
        <el-button type="primary" @click="goAddpage">添加商品</el-button>
       </el-col>
     </el-row>
     <!-- table表格区域 -->
     <el-table :data="goodsList" border stripe>
       <el-table-column type="index"></el-table-column>
       <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
       <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
       <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
       <el-table-column label="创建时间" prop="add_time" width="140px">
         <template slot-scope="scope">
           {{scope.row.add_time | dataFormat}}
         </template>
       </el-table-column>
       <el-table-column label="操作" width="130px">
         <template slot-scope="scope">
           <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
           <el-button type="danger" size="mini"  icon="el-icon-delete"></el-button>
         </template>
       </el-table-column>
     </el-table>
     <!-- 分页区域 -->
     <el-pagination @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
   </el-card>
  </div>
</template>
<style scoped>

</style>
<script>
export default {
  data(){
    return {
    //查询参数对象
    queryInfo:{
      query:'',
      pagenum: 1,
      pagesize: 10
    },
    //商品列表
    goodsList:[],
    //总数据条数
    total:0,
    }
  },
  mounted(){
    //获取所有商品列表
    this.getGoodsList();
  },
methods:{
  getGoodsList(){
    this.axios.get('goods',{params:this.queryInfo
    }).then(res=>{
      let {data,meta}=res.data;
      if(meta.status!==200) return this.$message.error('获取商品列表失败');
      this.$message.success('获取商品列表成功');
      // console.log(data);
      this.goodsList=data.goods;
      // console.log(this.goodsList);
      this.total=data.total;
    })
  },
  //newSize每页条数
  handleSizeChange(newSize){
    this.queryInfo.pagesize=newSize;
    this.getGoodsList()
  },
  //newPage当前页码数
  handleCurrentChange(newPage){
    this.queryInfo.pagenum=newPage;
    this.getGoodsList();
  },
  goAddpage(){
    //路由导航
    this.$router.push('/goods/add');
  }
 }
}
</script>