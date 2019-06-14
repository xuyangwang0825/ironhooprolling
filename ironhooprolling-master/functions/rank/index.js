// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return DB.collection('score').limit(20).orderBy('score', 'desc').get({

    success: function (res) {

      wx.postMessage({

        rankdata: res.data,

      });

    }

  })
}

for (var i = 0; i < rankdata.length; i++) { var list = []; var score = rankdata.score; list.push(rankdata._openid);  wx.getUserInfo({ openIdList: list, success: (userRes) => {  let userData = userRes.data[0]; var avatarUrl = userData.avatarUrl;  var nick = userData.nickName; }, fail: (res) => { this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。"; } }) }