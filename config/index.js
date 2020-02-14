export default{
  projectName:'mp',
  version:1.0,
  model:'dev',
  env:{
    //mock地址
    mockUrl:'',
    //开发环境
    dev:{
      baseUrl:'http://localhost:8080'
    },
    //生产环境
    pro:{
      baseUrl:'http://www.damu.com'
    }
  }
}