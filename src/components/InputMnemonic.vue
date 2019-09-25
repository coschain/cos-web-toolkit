<template>
  <div>
    <div class="wallet-input">
      <div class="row">
        <label for="u-input">Enter your username:</label>
        <input type="text" class="form-control" id="u-input" placeholder="username in coschain" v-model="username"
               required>
      </div>
      <div class="row">
        <label for="p-input">Enter your mnemonic:</label>
        <input type="text" class="form-control" id="p-input" placeholder="Do NOT input in public"
               v-model="mnemonic" required>
      </div>
    </div>
    <button class="btn btn-primary" v-on:click="confirm" :disabled="!check">
      <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="checking"></vue-loading>
      <span v-if="!checking">Confirm</span>
    </button>
    <mnemonic-failed v-if="warning" @close="closeModal"></mnemonic-failed>
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'
import MnemonicFailed from './MnemonicFailed'
const axios = require('axios')
const {crypto} = require('cos-grpc-js')
export default {
  name: 'InputMnemonic',
  data () {
    return {
      username: '',
      mnemonic: '',
      privateKey: '',
      checking: false,
      warning: false
    }
  },
  methods: {
    closeModal: function () {
      this.warning = false
    },
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
        let result = crypto.generateKeyPairsFromMnemonic(this.mnemonic)
        if (!result) {
          alert('Parse nnemonic failed')
        }
        this.privateKey = result.privateKey
        let priv = crypto.privKeyFromWIF(this.privateKey)
        let pub = priv.pubKey()
        if (pub.toWIF() === r.data.info.publicKey) {
          // this.$store.commit('setBalance', r.data.info.coin.value)
          let balance = r.data.info.coin.value
          let vesting = r.data.info.vest.value
          let stake = r.data.info.stakeVestForMe.value
          let stamina = r.data.info.staminaFreeRemain + r.data.info.staminaStakeRemain
          this.$emit('data', {
            privkey: this.privateKey,
            username: this.username,
            balance: balance,
            vesting: vesting,
            stake: stake,
            stamina: stamina
          })
        } else {
          this.warning = true
        }
      } else {
        this.warning = false
      }
    }
  },
  computed: {
    check: function () {
      return this.username.length >= 6 && this.username.length <= 16 && this.username.match(/^[0-9a-z]+$/) && this.mnemonic.length >= 20
    }
  },
  components: {
    VueLoading,
    MnemonicFailed
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";

  .wallet-input {
    .row {
      margin-left: 0;
      margin-right: 0;
    }
    & > .row + .row {
      margin-top: 26px;
    }
  }
  label {
    font-size: 16px;
  }

  button {
    margin-top: 42px;
  }
</style>
