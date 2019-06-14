import Player     from './player/index'
import Enemy      from './npc/enemy'
import Flower     from './npc/flower'
import Stone      from './npc/stone'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'
import Button     from './base/button'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

let nickName
let avatarUrl

/**
 * 游戏主函数
 */
class Main {
  constructor() {

    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
  }

  restart() {
    databus.reset()
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的物体生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let ran = Math.floor(Math.random() * 3)
      let enemy = ran == 0 ? databus.pool.getItemByClass('flower', Flower) : (ran == 1 ? databus.pool.getItemByClass('stone', Stone) : databus.pool.getItemByClass('enemy', Enemy))
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }
  floatageGenerate() {
    if ((this.updateTimes * Constants.Floatage.SpawnRate) % Config.UpdateRate
      < Constants.Floatage.SpawnRate
      && databus.floatages.length < Constants.Floatage.SpawnMax) {
      let floatage = databus.pool.getItemByClass('floatage', Floatage)
      floatage.init(Constants.Floatage.Speed)
      databus.floatages.push(floatage)
    }
  }
  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        let xxx = enemy.ret()
        if (xxx == 0) {
          databus.score -= 1;
          continue;

        }
        else if (xxx == 1) {
          databus.score += 1
          continue;
        }
        else if (xxx == 2) {
          databus.gameOver = true
          wx.cloud.init({
            traceUser: true,
            env: 'lalala-xos91'
          })
          wx.cloud.callFunction({
            // 云函数名称
            name: 'add',
            // 传给云函数的参数
            data: {
              score: Math.floor(databus.frame / 50 + databus.score),
              nickName: nickName,
              avatarUrl: avatarUrl
            },
            success: function (res) {
            },
            fail: console.error
          })
          console.log(nickName);
          console.log(avatarUrl);
        }
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea
    let area2 = this.gameinfo.btnArea2
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
    else if (x >= area2.startX
      && x <= area2.endX
      && y >= area2.startY
      && y <= area2.endY)
      databus.reset()
    new Menu()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bg.render(ctx)


    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)
    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.frame / 50 + databus.score)

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.frame / 50 + databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver)
      return;

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()

    /*if ( databus.frame % 20 === 0 ) {
      this.player.shoot()
      this.music.playShoot()
    }*/
  }

  // 实现游戏帧循环
  loop() {

    if (!databus.gameOver) databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}

let main = new Main()

export default class Menu {
  loop() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    ctx.fillStyle = "#000000";
    ctx.font = "40px Arial";
    ctx.drawImage(this.img5, screenWidth * 0.05, -10, screenWidth * 0.9, screenWidth * 0.9)
    ctx.fillText("一起滚铁环", screenWidth / 2 - 90, screenHeight / 2+45);
    ctx.drawImage(this.img1, screenWidth*0.9-30, 50, 60, 40)
    ctx.drawImage(this.img3, screenWidth / 2 - 274 * 0.3, screenHeight / 2+80, 274 * 0.6, 117 * 0.6)
    ctx.drawImage(this.img4, screenWidth*0.75 , screenHeight*0.8, 80, 80)
    this.player.width = 100;
    this.player.height = 100;
    //this.player.x = screenWidth/2 -50;
    this.player.y = screenHeight/2-100;
    this.player.drawToCanvas(ctx)
    this.player.img.src = 'images/hero1.jpg'
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    if (this.flag == 1) {
      ctx.fillStyle = "#ffffff"
      ctx.font = "18px Arial"
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.9;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      ctx.globalAlpha = 1;
      ctx.drawImage(this.img2, 0, 0, screenWidth, screenHeight);
    }
    else if(this.flag == 2){
      ctx.fillStyle = "#ffffff"
      ctx.font = "18px Arial"
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.6;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      ctx.globalAlpha = 1;
      this.drawRank();
      //ctx.drawImage(this.img5, screenWidth*0.1, screenHeight*0.1, screenWidth*0.8, screenHeight*0.8);
    }
  }

  updateRank(){
    var that=this;
    wx.cloud.init({
      traceUser: true,
      env: 'lalala-xos91'
    })
    const db = wx.cloud.database()
    db.collection('scoreRecord').limit(20).orderBy('score', 'desc').get({
      success: function (res) {
        that.rankData=res;
      }
    })
  }

  drawRank(){
    ctx.fillStyle = "#40E0D0"
    ctx.fillRect(50,50,screenWidth-100,screenHeight-100);
    ctx.fillStyle="white";
    ctx.font = "30px Arial"
    var i;
    var top = this.rankData.data.length > 10 ? 10 : this.rankData.data.length;
    ctx.fillText("排行榜", 70, 90);
    ctx.font = "20px Arial"
    ctx.fillText("用户", 70, 130);
    ctx.fillText("分数", 250, 130);
    for(i=0;i<top;i++){
      let image = new Image();
      image.src = this.rankData.data[i].avatarUrl;
      ctx.fillText(this.rankData.data[i].nickName,140,175+50*i);
      ctx.drawImage(image,70,150+50*i,40,40);
      ctx.fillText(this.rankData.data[i].score, 250, 175 + 50 * i);
    }
    
  }
  access(){
    var tmpflag=0;
    var that = this;
      let button = wx.createUserInfoButton({
        type: 'text',
        text: '',
        style: {
          left: screenWidth * 0.75,
          top: screenHeight * 0.8,
          width: 80,
          height: 80,
          lineHeight: 40,
          backgroundColor: '',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: 16,
          borderRadius: 10
        }
      });
      button.onTap(function (res) {
        wx.getUserInfo({
          success: function (res) {
            let userInfo = res.userInfo;
            nickName = userInfo.nickName;
            avatarUrl = userInfo.avatarUrl;
          },
          fail: function (res) {
            console.log(res);
          }
        })
        button.hide();
      });
  }

  constructor() {
    this.flag = 0;
    this.img1 = new Image();
    this.img1.src = 'images/help.png'
    this.img2 = new Image();
    this.img2.src = 'images/puzzle-help.png'
    this.img3 = new Image();
    this.img3.src = 'images/start.png'
    this.img4 = new Image();
    this.img4.src = 'images/rank1.png'
    this.img5 = new Image();
    this.img5.src = 'images/menu.png'

    this.access();
    this.updateRank();
    this.player = new Player(ctx);
    this.bindLoop = this.loop.bind(this);
    this.touchHandler = this.touchEventHandler.bind(this);
    this.btnArea = {
      startX: 0,
      endX: screenWidth,
      startY: screenHeight / 2,
      endY: screenHeight
    }
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    canvas.addEventListener('touchstart', this.touchHandler)
  }

  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.btnArea
    if (x >= screenWidth * 0.9 - 30 && x <= screenWidth * 0.9 + 30 && y >= 50 && y <= 90 && this.flag == 0) {
      this.flag = 1;
    }
    else if (x >= screenWidth / 2 - 274 * 0.3   
      && x <= screenWidth / 2 + 274 * 0.3
      && y >= screenHeight / 2 + 80
      && y <= screenHeight / 2 + 80 + 117 * 0.6 && this.flag == 0) {
      window.cancelAnimationFrame(this.aniId);
      canvas.removeEventListener('touchstart', this.touchHandler);
      main
    }
    else if (x >= screenWidth * 0.75
      && x <= screenWidth * 0.75+80
      && y >= screenHeight * 0.8
      && y <= screenHeight * 0.8+80) {
      this.flag = 2;
    }
    else if (this.flag == 1 && x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
      this.flag = 0;
    }
    else if (this.flag == 2 && x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY) {
      this.flag = 0;
    }
  }
}

