<template>
  <div id="app">
    <div class="background">
      <div class="layout">
        <div class="container">
          <img src="assets/header-logo.png"  alt="Contentos"/>
          <span>Wallet</span>
        </div>
        <Header></Header>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .background{
    background-image: url("assets/background.png");
    width: 100%;
    height: 259px;
  }
  .layout{
  }
</style>
