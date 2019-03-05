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
  name: 'Info',
  data () {
    return {
      filename: 'Select Your Account File',
      data: null,
      password: '',
      privkey: ''
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
      const mac = this.data.Mac
      const iv = this.data.Iv
      const cipher = this.data.CipherText
      // cipher:string, passphrase:string, iv:string, mac:string, pubkey:string
      let privkey = crypto.decryptPrivKey(cipher, this.password, iv, mac)
      if (privkey && privkey.length > 0) {
        this.privkey = privkey
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
  .content {
    font-size: 1.2rem;
  }
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
