## ironhooprolling

## 源码目录介绍
```

./audio                                    // 音频文件
./images                                   // 图片文件
./function                                 // 云函数类
├── add 
│   ├── add.js                             // 添加得分记录
├── rank 
│   ├── rank.js                            // 获取排行榜信息
./js
├── base                                   // 定义游戏开发基础类
│   ├── button.js                          // 按钮的基本类
│   ├── pool.js                            // 对象池的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── npc
│   ├──enemy.js                            // 草类（减分道具）
│   ├──flower.js                           // 花类（加分道具）
│   └──stone.js                            // 石头类
├── player                     
│   └── index.js                           // 玩家类
├── runtime
│   ├── background.js                      // 背景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏状态
└── main.js                                // 游戏入口主函数
└── menu.js								   // 游戏主菜单

```
