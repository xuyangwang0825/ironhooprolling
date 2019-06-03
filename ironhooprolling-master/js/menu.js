import Main from './main'
import Player from './player/index'
import Button from './base/button'
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
let ctx = canvas.getContext('2d')

const IMG_HELP_SRC = 'images/help.png'
const IMG_HELP_WIDTH = '60'
const IMG_HELP_HEIGHT = '40'

const IMG_HELP_CONTENT_SRC = 'images/puzzle-help.png'

export default class Menu{
  loop(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, screenWidth, screenHeight);
    ctx.fillStyle = "#000000";
    ctx.fillText("helloword", screenWidth / 2, screenHeight / 2);
    ctx.drawImage(this.img1, 350, 50, IMG_HELP_WIDTH, IMG_HELP_HEIGHT)
    this.player.drawToCanvas(ctx)
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
    if(this.flag ==1){
      ctx.fillStyle = "#ffffff"
      ctx.font = "18px Arial"
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.6;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
      ctx.globalAlpha = 1;
      ctx.drawImage(this.img2,0,0,screenWidth,screenHeight);
    } 
  }
  
  constructor(){
    this.flag = 0;
    this.img1 = new Image();
    this.img1.src = 'images/help.png'
    this.img2 = new Image();
    this.img2.src = 'images/puzzle-help.png'
    this.img3 = new Image();
    this.img3.src = 'images/start.png'

    this.player = new Player(ctx);
    this.bindLoop=this.loop.bind(this);
    this.touchHandler=this.touchEventHandler.bind(this);
    this.btnArea={
      startX : 0,
      endX : screenWidth,
      startY : screenHeight / 2,
      endY : screenHeight
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
    if(x>=350&&x<=410&&y>=50&&y<=90){
      this.flag = 1;
    }
    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY){
        window.cancelAnimationFrame(this.aniId);
        canvas.removeEventListener('touchstart',this.touchHandler);
        new Main();
      }
  }
}