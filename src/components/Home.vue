<template>
  <div>
  <h2>Generate New Keypair</h2>
  <div>
    <h4>New Public Key</h4>
    <p>{{ publicKey }}</p>
    <h4>New Private Key</h4>
    <p>{{ privateKey }}</p>
  </div>
  <button v-on:click="generateKeys">Redeem</button>
  <router-link :to="{name: 'Create', params: { pubkey: publicKey}}">
    <button :disabled="publicKey === ''">Create</button>
  </router-link>
  </div>
</template>

<script>
const {crypto} = require('cos-grpc-js')

export default {
  name: 'Home',
  data () {
    return {
      // msg: 'Welcome to Your Vue.js App'
      publicKey: '',
      privateKey: ''
    }
  },
  methods: {
    generateKeys: function () {
      let priv = crypto.generatePrivKey()
      this.privateKey = priv.toWIF()
      this.publicKey = priv.pubKey().toWIF()
    }
  }
}
</script>

<style>

</style>
