<template>
  <div id="app">
    <div class="container-fluid">
      <template v-if="enableAlert">
        <div class="row">
          <div class="col-12 test-warning">
            <img src="/static/img/cos_warn.png" class="warningIcon" alt="">
            <div class="careful">Be careful,This is the test network for Contentos. Any trading information is for testing purposes. </div>
          </div>
        </div>
      </template>
    </div>
    <div class="background">
      <div class="container">
        <div class="logo-header">
          <div class="logo"></div>
          <p class="spot"></p>
          <p class="title">Wallet</p>
        </div>
        <div class="content-body">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      enableAlert: process.env.VUE_APP_FAUCET
    }
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f6f6f6;
    height: 100vh;
  }
  .background{
    background-image: url("./assets/background.png");
    background-repeat: no-repeat;
    background-size: 100% 259px;
  }
  .container {
    max-width: 1200px;
    padding-left: 0;
    padding-right: 0;
  }
  .logo-header {
    padding-top: 49px;
    & > * {
      vertical-align: middle;
    }
    .logo {
      display: inline-block;
      background-image: url("./assets/header-logo.png");
      background-repeat: no-repeat;
      background-size: contain;
      width: 250px;
      height: 80px;
    }
    p {
      display: inline-block;
      &.spot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #ffffff;
        margin-left: 16px;
        margin-right: 16px;
      }
      &.title {
        font-size: 30px;
        color: #ffffff;
      }
    }
  }
  .content-body {
    margin-top: 26px;
  }

  .test-warning {
    color: white;
    text-align: center;
    background: #5869FF;
    font-weight: 500;
    font-size: medium;
  }
  .careful {
    display: inline;
  }

  .warningIcon {
    width: 22px;
    height: 22px;
    margin-top: -1px;
  }
</style>
