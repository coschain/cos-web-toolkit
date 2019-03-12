<template>
  <div class="container body py-2">
    <div class="wallet-input">
      <label for="u-input" class="py-2">Enter your username:</label>
      <input type="text" class="form-control py-3" id="u-input" placeholder="username in coschain" v-model="username" required>
      <label for="p-input" class="py-2">Enter your private key:</label>
      <input type="password" class="form-control py-3" id="p-input" placeholder="Do NOT input in public" v-model="privateKey" required>
    </div>
    <button class="btn btn-block" v-on:click="confirm" :disabled="!check">Confirm</button>
  </div>
</template>

<script>
export default {
  name: 'InputPrivKey',
  data () {
    return {
      username: '',
      privateKey: ''
    }
  },
  methods: {
    confirm: function () {
      this.$emit('data', {privkey: this.privateKey, username: this.username})
    }
  },
  computed: {
    check: function () {
      return this.username.length >= 6 && this.username.length <= 16 && this.username.match(/^[0-9a-zA-Z]+$/) &&
        this.privateKey.length >= 30 && this.privateKey.match(/^[0-9a-zA-Z]+$/)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
</style>
