<template>
  <div class="container py-2">
    <p>We generated this private key to create your account. Be careful, your account could be accessed by anyone who
      knows the private key or mnemonic. Please keep them safe. Or you can <a class="link-like" v-on:click="generateMnemonicWithKeys">regenerate</a> a new one.</p>
    <h4>Mnemonic</h4>
    <div class="mnemonic">
      <p class="key"><span class="pink">{{ mnemonic }}</span></p>
      <p class="tips">Write mnemonic down or save it into a offline usb flash disk.</p>
    </div>
    <div class="privkey">
      <h4>private key</h4>
      <p class="key"><span class="pink">{{ privateKey }}</span></p>
      <p class="tips">Write private key down or save it into a offline usb flash disk.</p>
    </div>
    <button class="btn btn-block" v-on:click="gotoCheck">Next</button>
  </div>
</template>

<script>

const {crypto} = require('cos-grpc-js')

export default {
  name: 'Generate',
  props: ['username'],
  data () {
    return {
      privateKey: '',
      publicKey: '',
      mnemonic: ''
    }
  },
  mounted () {
    this.generateMnemonicWithKeys()
  },
  methods: {
    gotoCheck: function () {
      console.log(this.username)
      this.$router.push({name: 'CheckAndCreate', params: {username: this.username, mnemonic: this.mnemonic, privateKey: this.privateKey}})
    },
    generateMnemonicWithKeys: function () {
      let mnemonic = crypto.generateMnemonic()
      let result = crypto.generateKeyPairsFromMnemonic(mnemonic)
      if (!result) {
        alert('Generated Failed')
      }
      this.mnemonic = mnemonic
      this.privateKey = result.privateKey
      this.publicKey = result.publicKey
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  h4 {
    padding-bottom: 10px;
  }
  a {
    color: #007bff !important;
    text-decoration: none !important;
    background-color: transparent;
    &:hover {
      cursor: pointer;
    }
  }
  .key {
    font-family: monospace;
    border: 1px solid #e5e5e5;
    padding: 15px;
    span {
      display: inline-block;
    }
    font-weight: 500;
    .mnemonic {
      vertical-align: top;
    }
    .desc {
      width: 100px;
      text-align: left;
      &:after {
        content: ":";
      }
    }
    .pink {
      text-align: left;
      color: #e83e8c;
      word-break: break-word;
    }
  }
</style>
