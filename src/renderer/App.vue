<template>
  <div id="app">
    <div class="fake-title-bar" v-if='isTitle'>
      王者荣耀兵线计时器 v1.0.0
      <div class="handle-bar" v-if="1 === 'win32'">
        <i class='el-icon-minus' @click="mini"></i>
        <i class='el-icon-close' @click="close"></i>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    mini () {
      console.log('mini')
    },
    close () {
      console.log('close')
    }
  },
  computed: {
    isTitle () {
      return this.$store.state.appTitle.isTitle
    }
  }
}
</script>


<style lang="stylus">
#app {
  .fake-title-bar {
    text-align: center;
    -webkit-app-region: drag;
    height: 30px;

    .handle-bar {
      -webkit-app-region: nodrag;
    }
  }
}
</style>
