<template>
  <div class="container">
    <div class="box">
      <h3>Make Sure You Have Saved</h3>
      <div class="nav-scroller">
        <nav class="nav d-flex justify-content-start">
          <div class="px-2 nav-item-text" :class="{active: current === 'mnemonic'}" @click="current='mnemonic'">Verify Mnemonic</div>
          <div class="px-2 nav-item-text" :class="{active: current === 'privkey'}" @click="current='privkey'">Verify Private Key</div>
        </nav>
      </div>
      <template v-if="current === 'mnemonic'">
        <label for="m-input">Input Generated Mnemonic:</label>
        <input type="text" class="form-control" id="m-input" placeholder="Do NOT input in public" v-model="input_mnemonic" required>
      </template>
      <template v-if="current === 'privkey'">
        <label for="p-input">Input Generated Private Key:</label>
        <input type="text" class="form-control" id="p-input" placeholder="Do NOT input in public" v-model="input_privkey" required>
      </template>
      <vueTencentCaptcha class="btn btn-primary" appid="2085519879" @callback="captchaCallback">
        <vue-loading type="spin" color="rgba(255,255,255,0.7)" :size="{ width: '30px', height: '30px' }" v-if="creating"></vue-loading>
        <span v-if="!creating">Verify</span>
      </vueTencentCaptcha>
    </div>
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'
const axios = require('axios')
const {crypto} = require('cos-grpc-js')
export default {
  name: 'CheckAndCreate',
  props: ['mnemonic', 'privateKey', 'username'],
  data () {
    return {
      creating: false,
      input_mnemonic: '',
      input_privkey: '',
      current: 'mnemonic'
    }
  },
  methods: {
    captchaCallback: async function (res) {
      if (res.ret === 0) {
        let ticket = res.ticket
        let randstr = res.randstr
        if (this.input_mnemonic.length > 0) {
          await this.verify_mnemonic(ticket, randstr)
        } else if (this.input_privkey.length > 0) {
          await this.verify_privkey(ticket, randstr)
        }
      }
    },
    verify_mnemonic: async function (ticket, randstr) {
      if (this.input_mnemonic === this.mnemonic) {
        await this.createAccount(ticket, randstr)
      } else {
        alert("mnemonic doesn't match")
      }
    },
    verify_privkey: async function (ticket, randstr) {
      if (this.input_privkey === this.privateKey) {
        await this.createAccount(ticket, randstr)
      } else {
        alert("private key doesn't match")
      }
    },
    createAccount: async function (ticket, randstr) {
      this.creating = true
      let priv = crypto.privKeyFromWIF(this.privateKey)
      let pub = priv.pubKey()
      let publicKey = pub.toWIF()
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/create_account' : '/v1/create_account',
        data: {
          username: this.username,
          pubkey: publicKey,
          randstr: randstr,
          ticket: ticket
        }
      })
      console.log(r)
      if (r.data.success) {
        this.$store.commit('setUsername', this.username)
        this.$store.commit('setPrivkey', this.privateKey)
        this.$router.push({name: 'CreateSuccess', params: { username: this.username }})
      } else {
        alert('Register Account Failed')
      }
      this.creating = false
    }
  },
  components: {
    VueLoading
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .box {
  }
  .nav-scroller {
    margin-bottom: 42px;
   }
  .nav-item-text {
    font-size: 18px;
    color: #999999;
    letter-spacing: 0;
    &:hover {
      cursor: pointer;
    }
  }
  nav > div:first-child {
    padding-left: 0 !important;
  }
  nav > div + div {
    border-left: 1px solid #aaa;
  }
  .btn {
    margin-top: 42px;
    line-height: 40px;
  }
</style>
