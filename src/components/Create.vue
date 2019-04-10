<template>
  <div class="container body py-2">
    <div class="generate-key">
      <h2 class="py-3">Generate a unique <span class="pink">key pair</span> for Contentos</h2>
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
          <label for="q-input" class="py-2">Public key</label>
          <input type="text" class="form-control py-3" id="q-input" v-model="publicKey" disabled>
        </div>
        <button class="btn btn-block" v-on:click="createAccount" :disabled="!checkBoth">
          <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="creating"></vue-loading>
          <span v-if="!creating">Create a new account</span>
        </button>

      <p class="helper py-2">
        You should write down your public key and private key in secret. <br/>
        DO NOT leak your private key to others.
      </p>
    </template>
  </div>
</template>

<script>
// import saver from './Saver.vue'
import modal from './Modal'
import { VueLoading } from 'vue-loading-template'
const {crypto} = require('cos-grpc-js')
const axios = require('axios')

export default {
  name: 'Home',
  data () {
    return {
      username: '',
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
        alert('Register Account Success! Please Save your PrivateKey. You can now try faucet to get COS, transfer it or post a topic!')
        this.$store.commit('setUsername', this.username)
        this.$store.commit('setPrivkey', this.privateKey)
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
    checkCreating: function () {
      return this.creating
    }
  },
  computed: {
    checkBoth: function () {
      return this.checkUsername() && !this.checkCreating()
    }
  },
  components: {
    // saver,
    modal,
    VueLoading
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
