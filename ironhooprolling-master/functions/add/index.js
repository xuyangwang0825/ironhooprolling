// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() //初始化，小程序调用函数前必须要要先调用初始化
const db = cloud.database()//操作数据库必须添加的字段，是固定的
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('scoreRecord').add({
    data:{
      score : event.score,
      nickName: event.nickName,
      avatarUrl:event.avatarUrl,
      id    : wxContext.OPENID
    },
    success: function (res) {
      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
      console.log(res)
    }
  })
}