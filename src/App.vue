<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style lang="scss">
  #app {
    font-family: open sans, helvetica neue, helvetica, arial, sans-serif;
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
