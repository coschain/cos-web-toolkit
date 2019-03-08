<template>
  <div class="container body py-2">
    <div class="wallet-input">
      <label for="u-input" class="py-2">Enter a username:（Between 6 and 16 characters）</label>
      <input type="text" class="form-control py-3" id="u-input" placeholder="Your Username" v-model="username">
      <label for="p-input" class="py-2">Enter a password:（Not less than 9 characters）</label>
      <input type="password" class="form-control py-3" id="p-input" placeholder="Do NOT forget to save this!" v-model="password">
    </div>
    <button class="btn btn-block" v-on:click="createAccount">Create A New Account</button>
    <saver v-bind:username="username" v-bind:password="password" v-bind:privkey="privateKey" v-bind:pubkey="publicKey" v-if="ok"></saver>
    <p class="wallet-helper py-2">
      This password encrypts your private key. <br />
      This does not act as a seed to generate your keys. <br />
      You will need this password + your private key to unlock your wallet.
    </p>
  </div>
</template>

<script>
import saver from './Saver.vue'
const {crypto} = require('cos-grpc-js')
const axios = require('axios')

export default {
  name: 'Home',
  data () {
    return {
      username: '',
      password: '',
      privateKey: '',
      publicKey: '',
      ok: false
    }
  },
  methods: {
    generateKeys: function () {
      let priv = crypto.generatePrivKey()
      this.privateKey = priv.toWIF()
      this.publicKey = priv.pubKey().toWIF()
    },
    createAccount: async function () {
      this.generateKeys()
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/create_account' : '/v1/create_account',
        data: {
          username: this.username,
          pubkey: this.publicKey
        }
      })
      if (r.data.success) {
        this.ok = true
      } else {
        alert('create account failed')
      }
    }
  },
  components: {
    saver
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .wallet-helper {
    font-size: 0.8rem;
  }
</style>
