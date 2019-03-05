<template>
  <div class="container body py-2">
    <div class="wallet-input">
      <label for="u-input" class="py-2">Enter a username:（Between 6 and 16 characters）</label>
      <input type="text" class="form-control py-3" id="u-input" placeholder="Your Username" v-model="username">
      <label for="p-input" class="py-2">Enter a password:（Not less than 9 characters）</label>
      <input type="password" class="form-control py-3" id="p-input" placeholder="Do NOT forget to save this!" v-model="password">
    </div>
    <button class="btn btn-block" v-on:click="createAccount">Create A New Account</button>
    <template v-if="ok">
      <h2 class="py-3">Saver your <span class="pink">Keystore File</span></h2>
      <button class="btn btn-block" v-on:click="downloadEncryptedAccount">Download Keystore File</button>
    </template>
    <p class="wallet-helper py-2">
      This password encrypts your private key. <br />
      This does not act as a seed to generate your keys. <br />
      You will need this password + your private key to unlock your wallet.
    </p>
  </div>
</template>

<script>
const {crypto} = require('cos-grpc-js')
const axios = require('axios')
const FileSaver = require('file-saver')

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
      // do not create actually
      this.generateKeys()
      let r = await axios({
        method: 'post',
        url: 'http://localhost:3000/v1/create_account',
        data: {
          username: this.username,
          pubkey: this.publicKey
        }
      })
      console.log(r)
      if (r.data.success) {
        this.ok = true
      }
    },
    downloadEncryptedAccount: async function () {
      let data = crypto.generateEncryptedJson(this.username, this.password, this.publicKey, this.privateKey)
      let json = JSON.stringify(data)
      let blob = new Blob([json], {type: 'application/json'})
      FileSaver.saveAs(blob, `COS-KEYJSON-${this.username}.json`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-control {
    background-color: #f5f5f5;
    border-radius: 3px;
    box-shadow: none;
    color: #565656;
    font-size: 0.875rem;
    line-height: 1.43;
    min-height: 3em;
    padding: 0.2em 1.07em 0.2em;
    border: 1px solid #e8e8e8;
  }
  .btn {
    background-color: black;
    border-radius: 0;
    color: white;
    font-weight: 500;
    letter-spacing: 2px;
    margin: 1rem 0 .5rem 0;
    padding: 0.75rem 2.1875rem;
  }
  .btn-block {
    display: block;
    width: 100%;
  }
  .wallet-helper {
    font-size: 0.8rem;
  }
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
</style>
