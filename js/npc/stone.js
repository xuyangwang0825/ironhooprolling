import Sprite from '../base/sprite'
import Animation from '../base/animation'
import AnimationBuilder from '../base/animbuilder'
import DataBus from '../databus'
const ENEMY_IMG_SRC = 'images/stone.png'
const ENEMY_WIDTH = 120
const ENEMY_HEIGHT = 120
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

const __ = {
  speed: Symbol('speed')
}

let databus = new DataBus()

function rnd() {
  return Math.ceil(Math.random() * 3)
}

export default class Enemy extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)
    this.initExplosionAnimation()
  }

  init(speed) {
    let ran = rnd()
    if (ran === 1) this.x = screenWidth / 2 - this.width / 2;
    else if (ran === 2) this.x = screenWidth * 1.7 / 6 - this.width / 2;
    else if (ran === 3) this.x = screenWidth * 4.3 / 6 - this.width / 2;
    this.y = -this.height+210

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }
  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height)
      databus.removeEnemey(this)
  }

  destroy() {
    this.visible = false
    let explosionAnim = databus.pool.getItemByClass('animation', Animation, Enemy.frames)
    //NOTE: 回调函数必须被重新设置，否则会有玄妙的后果..(回调到其他敌机实例去)
    explosionAnim.onFinished = () => {  //对象回收
      databus.removeAnimation(explosionAnim)
      databus.removeEnemey(this)
    }
    explosionAnim.start()
    this[__.explosionAnim] = explosionAnim
  }
}
