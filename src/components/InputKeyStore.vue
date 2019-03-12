<template>
  <div class="container body py-2">
    <p class="content">Select Your Account File:</p>
    <div class="file-uploader">
      <label for="f-uploader" class="file-uploader py-2">{{ filename }}</label>
      <input type="file" id="f-uploader" accept="application/json" @change="onFileChange">
    </div>
    <template v-if="ok">
      <label for="p-input" class="py-2">Your wallet is encrypted. Good! Please enter the password.</label>
      <input type="password" class="form-control py-3" id="p-input" v-model="password">
    </template>
    <button class="btn btn-block" v-on:click="unlock">Unlock</button>
  </div>
</template>

<script>
const {crypto} = require('cos-grpc-js')

export default {
  name: 'InputKeyStore',
  data () {
    return {
      filename: 'Select Your Account File',
      data: null,
      password: ''
    }
  },
  methods: {
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (files.length) {
        const f = files[0]
        const reader = new FileReader()
        let vm = this
        reader.onload = (e) => {
          vm.data = JSON.parse(e.target.result)
          vm.filename = f.name
        }
        reader.readAsText(f)
      }
    },
    unlock () {
      // const pubkey = this.data.PubKey
      const username = this.data.Name
      const mac = this.data.Mac
      const iv = this.data.Iv
      const cipher = this.data.CipherText
      let privkey = crypto.decryptPrivKey(cipher, this.password, iv, mac)
      if (privkey && privkey.length > 0) {
        this.$emit('data', {privkey: privkey, username: username})
      } else {
        this.$emit('failed')
      }
    }
  },
  computed: {
    ok () {
      return this.data && this.filename.startsWith('COS-KEYJSON')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .content {
    font-size: 1.2rem;
  }
  .file-uploader {
    background-color: #f5f5f5;
    border-radius: 3px;
    cursor: pointer;
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    height: auto;
    line-height: 2rem;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
  input[type="file"] {
    display: none;
  }
</style>
