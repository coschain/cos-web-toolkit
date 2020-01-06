<template>
  <div class="container transparent">
    <div class="row">
      <div class="col-md-6">
        <div class="vertical-container">
          <div class="header">
            <p>I don't have a Contentos account</p>
          </div>
          <div class="body">
            <router-link class="btn" to="accountname" tag="button">Create a new account</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="vertical-container">
          <div class="header">
            <p>I have a Contentos account</p>
          </div>
          <div class="body">
            <router-link class="btn" to="import" tag="button">Import an account</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 offset-3">
      <div class="connecting">
        <button class="btn-modal-large" @click="connect">Connect to COSWallet</button>
      </div>
    </div>
  </div>
</template>

<script>
import {compareChainIdWithNodeEnv, isCosWalletExtensionExist} from '../encrypt/util'

export default {
  name: 'Choice',
  methods: {
    async connect () {
      if (!isCosWalletExtensionExist()) {
        alert('COSWallet not be installed')
      }
      // eslint-disable-next-line no-undef
      let currentAccount = await ContentosWallet.getDefaultAccount()
      if (!compareChainIdWithNodeEnv(currentAccount.network)) {
        alert('ChainId mismatch')
      } else {
        this.$store.commit('setUsername', currentAccount.account)
        this.$store.commit('setPubKey', currentAccount.publicKey)
        this.$store.commit('setExtensionOn', true)
        this.$router.push({name: 'Account'})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .vertical-container {
    width: 580px;
    height: 280px;
    background-color: #ffffff;
    text-align: center;
    box-shadow: 2px 4px 30px 0 rgba(0,39,170,0.16);
    border-radius: 8px;
    p {
      font-size: 24px;
      color: #000000;
      letter-spacing: 0;
    }
    .header {
      padding-top: 80px;
    }
    .body {
      padding-top: 59px;
    }
    .btn {
      width: 390px;
      height: 52px;
      margin: auto;
      display: block;
    }
  }
  .connecting {
    padding-top: 59px;
  }
</style>
