<template>
  <div>
      <h2 class="py-3">Save your <span class="pink">Keystore File</span></h2>
      <button class="btn btn-block" v-on:click="downloadEncryptedAccount">Download Keystore File</button>
  </div>
</template>

<script>
const FileSaver = require('file-saver')
const {crypto} = require('cos-grpc-js')


export default {
  name: 'Saver',
  props: ['username', 'password', 'pubkey', 'privkey'],
  methods: {
    downloadEncryptedAccount: async function () {
      let data = crypto.generateEncryptedJson(this.username, this.password, this.pubkey, this.privkey)
      let json = JSON.stringify(data)
      let blob = new Blob([json], {type: 'application/json'})
      FileSaver.saveAs(blob, `COS-KEYJSON-${this.username}.json`)
    }
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
</style>
