<template>
  <div class="container body py-2">
    <div class="wallet-input">
      <label for="u-input" class="py-2">Enter your username:</label>
      <input type="text" class="form-control py-3" id="u-input" placeholder="username in coschain" v-model="username" required>
      <label for="p-input" class="py-2">Enter your private key:</label>
      <input type="password" class="form-control py-3" id="p-input" placeholder="Do NOT input in public" v-model="privateKey" required>
    </div>
    <button class="btn btn-block" v-on:click="confirm" :disabled="!check">
      <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="checking"></vue-loading>
      <span v-if="!checking">Confirm</span>
    </button>
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'
const axios = require('axios')
const {crypto} = require('cos-grpc-js')
export default {
  name: 'InputPrivKey',
  data () {
    return {
      username: '',
      privateKey: '',
      checking: false
    }
  },
  methods: {
    confirm: async function () {
      this.checking = true
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/account' : '/v1/account',
        data: {
          name: this.username
        }
      })
      this.checking = false
      console.log(r)
      if (r.data && r.data.info && r.data.info.publicKey) {
        let priv = crypto.privKeyFromWIF(this.privateKey)
        let pub = priv.pubKey()
        if (pub.toWIF() === r.data.info.publicKey) {
          // this.$store.commit('setBalance', r.data.info.coin.value)
          let balance = r.data.info.coin.value
          let vesting = r.data.info.vest.value
          let stake = r.data.info.stakeVestForMe.value
          let stamina = r.data.info.staminaFreeRemain + r.data.info.staminaStakeRemain
          this.$emit('data', {privkey: this.privateKey,
            username: this.username,
            balance: balance,
            vesting: vesting,
            stake: stake,
            stamina: stamina})
        } else {
          alert('Account does not match with private key')
        }
      } else {
        alert('Account does not exist')
      }
    }
  },
  computed: {
    check: function () {
      return this.username.length >= 6 && this.username.length <= 16 && this.username.match(/^[0-9a-zA-Z]+$/) &&
        this.privateKey.length >= 30 && this.privateKey.match(/^[0-9a-zA-Z]+$/)
    }
  },
  components: {
    VueLoading
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
</style>
