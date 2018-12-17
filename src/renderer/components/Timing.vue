<template>
  <div class="timing-container">
    <div class="normal-wrapper" v-if='!isReducedMode'>
      <div class="timewr">
        <div class="current-time"> 游戏时间：{{currentTime| currentTime}} </div>
        <div class="solider-time"> 兵线时间：
          <span class='big-time'>{{soliderTime.toFixed(1)}} </span>
        </div>
        <div class="solider-count"> 兵线次数：{{soliderCount}} </div>
      </div>
      <div class="timewr">
        <button class='' @click='toggleReducedMode'>{{isReducedMode ? '退出精简模式' : '进入精简模式'}}</button>
        <div class="dragon-counte"> 打龙次数：{{dragonCount}} </div>
        <button class='' @click='toggleTop'>{{isTop ? '置顶' : '取消置顶'}}</button>
      </div>
      <div class="btnwr">
        <button class='' @keyup.right='add1' @click='add1'>+1s(right)</button>
        <button class='' @keyup.space='start' @click='start'>开始计时(space)</button>
        <button class='' @keypup.left='minus1' @click='minus1'>-1s(left)</button>
      </div>
      <div class="miscwr">
        <button class='' @keyup.enter="bitDragon" @click="bitDragon">打龙(enter)</button>
        <button class='' @keyup.down='start5' @click='start5'>从5s计时(down)</button>
        <button class='' @keyup.delete='clear()' @click="clear">清空(delete)</button>
      </div>
      <div class="configwr">
        <div>
          <label for="兵线"> 兵线 <input type="number" v-model='cfg.solider'> </label>
        </div>
        <div>
          <label for="小龙"> 小龙 <input type="number" v-model='cfg.dragon'> </label>
        </div>
        <div>
          <label for="精简"> 直接精简 <input type="checkbox" v-model='cfg.reduce'> </label>
        </div>
        <div>
          <label for="精简x"> 精简x <input type="number" v-model.number='cfg.x'> </label>
        </div>
        <div>
          <label for="精简y"> 精简y <input type="number" v-model.number='cfg.y'> </label>
        </div>
      </div>
    </div>
    <div class="reduce-wrapper" v-else>
      <div class="button-bg">加1</div>
      <div class="button-bg">减1</div>
      <div class="button-bg">打龙</div>
      <div class="button-bg">退出</div>
      <div class="display-board">
        <span> 兵：{{soliderTime.toFixed(1)}} </span>
        <span> 游： {{currentTime| currentTime}} </span>
        <span> 波： {{soliderCount}} </span>
        <span> 龙： {{dragonCount}} </span>
      </div>
      <div class="reduce-wrapper fake">
        <div class="button-bg" @click="add1">加1</div>
        <div class="button-bg" @click="minus1">减1</div>
        <div class="button-bg" @click="bitDragon">打龙</div>
        <div class=" button-bg " @click="toggleReducedMode ">退出</div>
      </div>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  data () {
    return {
      currentWindow: {},
      currentTime: 0,
      dragonTime: 0,
      timing: null,
      dragonCount: 0,
      isTop: false,
      isReducedMode: false,
      cfg: {
        solider: 33,
        dragon: 7.5,
        x: 0,
        y: 0,
        reduce: false
      }
    }
  },
  computed: {
    soliderTime () {
      return (
        (this.cfg.solider - (this.currentTime - 10 + this.dragonTime) % this.cfg.solider) %
        this.cfg.solider
      )
    },
    soliderCount () {
      return Math.ceil((this.currentTime - 10 + this.dragonTime) / this.cfg.solider)
    }
  },
  methods: {
    add (second) {
      this.currentTime = this.currentTime + second
    },
    start () {
      this.clear()
      this.currentTime = 0
      this.timing = setInterval(() => {
        this.add(0.1)
      }, 100)
    },
    start5 () {
      this.clear()
      this.currentTime = 5
      this.dragonTime = 0
      clearInterval(this.timing)
      this.timing = setInterval(() => {
        this.add(0.1)
      }, 100)
    },
    add1 () {
      this.currentTime += 1
    },
    minus1 () {
      this.currentTime -= 1
    },
    bitDragon () {
      this.dragonTime += this.cfg.dragon
      this.dragonCount += 1
    },
    clear () {
      this.currentTime = 0
      this.dragonTime = 0
      clearInterval(this.timing)
    },
    toggleReducedMode () {
      let resizeData = {
        isReducedMode: this.isReducedMode,
        x: this.cfg.x,
        y: this.cfg.y
      }
      ipcRenderer.send('resize-me', resizeData)
      this.isReducedMode = !this.isReducedMode
      this.$store.commit('TOGGLE_TITLE')
    },
    toggleTop () {
      this.isTop = !this.isTop
    },
    displayPosition () {
      const position = this.currentWindow.getPosition()
      this.cfg.x = position[0]
      this.cfg.y = position[1]
    }
  },
  filters: {
    currentTime (value) {
      value = value.toFixed(1)
      let minus = Math.floor(value / 60)
      let second = (value % 60).toFixed(1)
      return `${minus}:${second}`
    }
  },
  mounted () {
    this.currentWindow = this.$electron.remote.getCurrentWindow()
    this.currentWindow.on('move', () => {
      this.displayPosition()
    })
    this.displayPosition()
    this.start()
  }
}
</script>
<style lang="stylus">
.timing-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 28px;
  min-width: 400px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  .normal-wrapper > div {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;

    & > button {
      width: 160px;
      height: 80px;
      font-size: 20px;
    }
  }

  .timewr {
    &>div {
      width: 300px;
    }
  }

  .configwr {
    width: 100%;
    font-size: 24px;

    input {
      height: 28px;
      width: 80px;
      font-size: 22px;
    }
  }
}

.reduce-wrapper {
  display: flex;
  width: 400px;
  height: 400px;
  flex-wrap: wrap;

  &.fake {
    position: absolute;
    background: red;
    left: 0;
    z-index: 10;
    // visibility: hidden;
    opacity: 0.1;
    -webkit-app-region: drag;
  }

  .button-bg {
    display: flex;
    width: 200px;
    height: 200px;
    background-color: #eee;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .button-bg:nth-child(1) {
    background-color: red;
  }

  .button-bg:nth-child(2) {
    background-color: yellow;
  }

  .button-bg:nth-child(3) {
    background-color: green;
  }

  .display-board {
    position: absolute;
    background-color: rgba(66, 66, 66, 0.66);
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 400px;
    left: 0;
    color: white;
    font-size: 55px;
    line-height: 100px;
  }
}
</style>
