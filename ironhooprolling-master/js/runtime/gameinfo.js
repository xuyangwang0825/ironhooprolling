const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      Math.floor(score),
      10,
      30
    )
    
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + Math.floor(score),
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 135,
      120, 40
    )
    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '地狱难度',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 160
    )
    ctx.fillText(
      '再来一局',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )
    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }

    this.btnArea2 = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 135,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 - 100 + 160
    }
    
  }
  renderRankList(ctx){
    wx.cloud.init({
      traceUser: true,
      env: 'lalala-xos91'
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'rank',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result.sum) // 3
      },
      fail: console.error
    })
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"

  }
}

