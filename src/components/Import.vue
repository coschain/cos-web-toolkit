<template>
  <div class="container body py-2">
    <div class="wallet-input">
      <label for="u-input" class="py-2">Enter a username:（Between 6 and 16 characters）</label>
      <input type="text" class="form-control py-3" id="u-input" placeholder="Your Username" v-model="username">
      <label for="k-input" class="py-2">Enter a private key:</label>
      <input type="text" class="form-control py-3" id="k-input" placeholder="Private Key" v-model="privkey">
      <label for="p-input" class="py-2">Enter a password:（Not less than 9 characters）</label>
      <input type="password" class="form-control py-3" id="p-input" placeholder="Do NOT forget to save this!" v-model="password">
    </div>
    <button class="btn btn-block" v-on:click="importAccount">Import An Account From Private Key</button>
    <saver v-bind:username="username" v-bind:password="password" v-bind:privkey="privkey" v-bind:pubkey="pubkey" v-if="ok"></saver>
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
  name: 'Import',
  data () {
    return {
      username: '',
      password: '',
      privkey: '',
      pubkey: '',
      ok: false
    }
  },
  methods: {
    importAccount: async function () {
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/account' : '/v1/account',
        data: {
          username: this.username,
          pubkey: this.pubkey
        }
      })
      console.log(r)
      if (Object.keys(r.data).length === 0 && r.data.constructor === Object) {
        alert('unknown account')
      } else {
        let priv = crypto.privKeyFromWIF(this.privkey)
        if (priv && priv.isValid()) {
          let pubKey = priv.pubKey()
          this.pubkey = pubKey.toWIF()
          this.ok = true
        } else {
          alert('private key format invalid')
        }
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
