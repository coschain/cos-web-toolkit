<template>
<div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 test-warning">
      <img src="/static/img/cos_warn.png" class="warningIcon" alt="">
      <div class="careful">Be careful,This is the test network for Contentos. Any trading information is for testing purposes. </div>
      </div>
    </div>
  </div>
  <div class="container">
    <header class="py-3 header">
      <div class="row flex-nowrap justify-content-between align-items-center">
        <div class="col-4 pt-1">
          <a class="logo-text" href="#">Contentos</a>
        </div>
      </div>
    </header>
    <div class="row">
      <div class="logo"></div>
    </div>
  </div>
  <div class="container">
    <div class="nav-scroller py-1 mb-2">
      <nav class="nav d-flex justify-content-between">
        <router-link class="p-2 nav-item-text" to="create">Create New Account</router-link>
        <!-- <router-link class="p-2 nav-item-text" to="import">Generate Keystore File</router-link> -->
        <router-link class="p-2 nav-item-text" to="faucet" v-if="enableFaucet">Faucet</router-link>
        <router-link class="p-2 nav-item-text" to="transfer">Transfer</router-link>
        <router-link class="p-2 nav-item-text" to="post">Post A Topic</router-link>
        <router-link class="p-2 nav-item-text" to="exchange">Exchange</router-link>
      </nav>
  </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      enableFaucet: process.env.VUE_APP_FAUCET
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    line-height: 1;
    border-bottom: 1px solid #e5e5e5;
  }
.logo-text {
  color: #333;
  font-size: 3.6rem;
}
  .nav-item-text {
    font-size: 1.2rem;
    color: #333;
  }
  .nav-scroller {
    border-bottom: 1px solid #e5e5e5;
  }
  .router-link-active {
    border-bottom: 2px solid #000;
  }
  a {
    &:hover {
      text-decoration: none;
    }
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
