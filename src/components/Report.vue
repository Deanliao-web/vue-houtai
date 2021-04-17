<template>
  <div>
         <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>数据统计</el-breadcrumb-item>
     <el-breadcrumb-item>数据报表</el-breadcrumb-item>
   </el-breadcrumb>
   <!-- 卡片视图 -->
   <el-card>
         <!--2 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 800px;height:400px;"></div>
   </el-card>
  </div>
</template>
<style scoped>

</style>
<script>
//1导入echarts html中的引入方法为 import echarts from './echarts.min.js'
//脚手架的引入商法
import * as echarts from 'echarts';
//导入lodash
import _ from 'lodash'
export default {
  data(){
    return {
      //需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted(){
  //3 基于准备好的dom，初始化echarts实例
   var myChart = echarts.init(document.getElementById('main'));
   this.axios.get('reports/type/1').then(res=>{
     let {data,meta}=res.data;
     if(meta.status!==200) return this.$message.error('获取数据失败');
     //使用lodash合并两个数据对象
     let result=_.merge(data,this.options);
     myChart.setOption(result);
   })

  }
  
}
</script>