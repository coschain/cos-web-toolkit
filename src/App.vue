<template>
  <div id="app">
    <h2>Generate New Keypair</h2>
    <div>
      <h4>New Public Key</h4>
      <p>{{ publicKey }}</p>
      <h4>New Private Key</h4>
      <p>{{ privateKey }}</p>
    </div>
    <button v-on:click="generateKeys">Redeem</button>
    <button>Create</button>
    <!--<router-view/>-->
  </div>
</template>

<script>
const { generatePrivKey } = require('../crypto/crypto')

export default {
  name: 'App',
  data: function () {
    return {
      publicKey: '',
      privateKey: '',
    }
  },
  methods: {
    generateKeys: function () {
      let priv = generatePrivKey()
      this.privateKey = priv.toWIF()
      this.publicKey = priv.pubKey().toWIF()
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
