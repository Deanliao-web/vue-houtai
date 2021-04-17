//项目发布阶段使用的插件
const proDplugins=[]
if(process.env.NODE_ENV==='production'){
  proDplugins.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //发布产品时使用插件移除console.log
   ...proDplugins,
   "@babel/plugin-syntax-dynamic-import"
  ]
}