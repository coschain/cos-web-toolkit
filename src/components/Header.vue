<template>
    <div class="container">
      <div class="box">
        <div class="nav-scroller py-1 mb-2">
          <nav class="nav d-flex justify-content-between">
            <router-link class="p-2 nav-item-text" to="account">Account</router-link>
            <router-link class="p-2 nav-item-text" to="faucet" v-if="enableFaucet">Faucet</router-link>
            <router-link class="p-2 nav-item-text" to="accountupdate">Account Update</router-link>
            <router-link class="p-2 nav-item-text" to="transfer">Transfer</router-link>
            <router-link class="p-2 nav-item-text" to="exchange">Exchange</router-link>
            <router-link class="p-2 nav-item-text" to="contract">Contract</router-link>
            <router-link class="p-2 nav-item-text" to="bpvote">BpVote</router-link>
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
  .container {
    padding-left: 0;
    padding-right: 0;
    background: #ffffff;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
    border-radius: 4px;
    .box {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
  .nav-item-text {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  /*.nav-scroller {*/
  /*  border-bottom: 1px solid #e5e5e5;*/
  /*}*/
  .router-link-active {
    border-bottom: 2px solid #3674FF;
    color: #3674FF;;
  }
  a {
    &:hover {
      text-decoration: none;
    }
  }

</style>
