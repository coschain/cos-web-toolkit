<template>
  <div class="container body py-2">
    <div class="generate-key">
      <h2 class="py-3">Generate Your Universal Unique <span class="pink">KEY-PAIR</span></h2>
      <template v-if="generated">
        <p class="key"><span class="desc">Public Key</span><span class="pink">{{ publicKey }}</span></p>
        <p class="key"><span class="desc">Private Key</span><span class="pink">{{ privateKey }}</span></p>
      </template>
      <button class="btn btn-block" v-on:click="generateKeys" v-if="!generated">Generate Key Pair</button>
      <modal v-if="showModal" @close="closeModal"></modal>
    </div>
    <template v-if="generated">
        <div class="wallet-input">
          <label for="u-input" class="py-2">Enter a username:（Between 6 and 16 characters）</label>
          <input type="text" class="form-control py-3" id="u-input" placeholder="username in coschain" v-model="username" required>
          <label for="p-input" class="py-2">Enter a password:（Not less than 9 characters）</label>
          <input type="password" class="form-control py-3" id="p-input" placeholder="Do NOT forget to save this!" v-model="password" required>
          <label for="q-input" class="py-2">Public key</label>
          <input type="text" class="form-control py-3" id="q-input" v-model="publicKey" disabled>
        </div>
        <button class="btn btn-block" v-on:click="createAccount" :disabled="!checkBoth">Register New Account</button>

        <saver v-bind:username="username" v-bind:password="password" v-bind:privkey="privateKey" v-bind:pubkey="publicKey" v-if="ok"></saver>
      <p class="helper py-2">
        This password encrypts your private key. <br />
        This does not act as a seed to generate your keys. <br />
        You will need this password + your private key to unlock your wallet.
      </p>
    </template>
  </div>
</template>

<script>
import saver from './Saver.vue'
import modal from './Modal'
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
      generated: false,
      showModal: false,
      ok: false,
      creating: false
    }
  },
  methods: {
    generateKeys: function () {
      let priv = crypto.generatePrivKey()
      this.privateKey = priv.toWIF()
      this.publicKey = priv.pubKey().toWIF()
      this.showModal = true
    },
    createAccount: async function () {
      this.creating = true
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
        alert('Register Account Success! Please Save your PrivateKey and download your KeyStore!')
      } else {
        alert('Register Account Failed')
      }
      this.creating = false
    },
    closeModal: function () {
      this.showModal = false
      this.generated = true
    },
    checkUsername: function () {
      return this.username.length >= 6 && this.username.length <= 16 && this.username.match(/^[0-9a-zA-Z]+$/)
    },
    checkPassword: function () {
      return this.password.length >= 9 && this.password.match(/^[0-9a-zA-Z]+$/)
    },
    checkCreating: function () {
      return this.creating
    }
  },
  computed: {
    checkBoth: function () {
      return this.checkUsername() && this.checkPassword() && !this.checkCreating()
    }
  },
  components: {
    saver,
    modal
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  h2 {
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    .pink {
      font-size: 87.5%;
      color: #e83e8c;
      word-break: break-word;
    }
  }
  .key {
    font-family: monospace;
    span {
      display: inline-block;
    }
    font-weight: 500;
    text-align: center;
    .desc {
      width: 100px;
      text-align: left;
      &:after {
        content: ":";
      }
    }
    .pink {
      width: 480px;
      text-align: left;
      color: #e83e8c;
      word-break: break-word;
    }
  }
  .helper {
    font-size: 0.8rem;
  }
</style>
