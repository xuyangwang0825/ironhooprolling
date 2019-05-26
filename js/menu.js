import Main from './main'
import Player from './player/index'
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
let ctx = canvas.getContext('2d')
export default class Menu{
  loop(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, screenWidth, screenHeight); 
    ctx.fillStyle = "#000000";
    ctx.fillText("helloword", screenWidth / 2, screenHeight/2);
    this.player.drawToCanvas(ctx)
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  
  constructor(){
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

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY){
        window.cancelAnimationFrame(this.aniId);
        console.log("hellow");
        new Main();
      }
  }
}