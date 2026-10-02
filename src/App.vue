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
    <div class="footer">
      <div class="logo"></div>
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
  @import "../static/scss/variables";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .background{
    flex: 1 0 auto;
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
  .footer {
    position: relative;
    flex-shrink: 0;
    height: 150px;
    width: 100%;
    .logo {
      display: inline-block;
      background-image: url("./assets/COS.png");
      background-repeat: no-repeat;
      background-size: contain;
      position: absolute;
      width: 163px;
      height: 73px;
      left: 50%;
      top: 50%;
      margin: -36px 0 0 -81px;
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

  @media (max-width: $bp-mobile-max) {
    .logo-header {
      padding: 24px $gutter-mobile 0;
      .logo {
        width: 160px;
        height: 52px;
      }
      p {
        &.spot {
          margin-left: 10px;
          margin-right: 10px;
        }
        &.title {
          font-size: 22px;
        }
      }
    }
    .content-body {
      padding: 0 $gutter-mobile;
    }
  }
</style>
