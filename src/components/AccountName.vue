<template>
  <div class="container">
    <div class="box">
      <h3>Create a new account</h3>
      <label for="u-input" class="py-2">Enter a username:（Between 6 and 16 characters, only lower letters and numbers are allowed.) </label>
      <input type="text" class="form-control py-3" id="u-input" placeholder="username in coschain" v-model="username" required>
      <button class="btn btn-primary" v-on:click="gotoGenerate" :disabled="!check">Next</button>
    </div>
  </div>
</template>

<script>
import {accountInfo} from '../encrypt/clientsign'
export default {
  name: 'AccountName',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    gotoGenerate: async function () {
      const r = await accountInfo(this.username)
      if (r.info === undefined) {
        this.$router.replace({name: 'Generate', params: {username: this.username}})
      } else {
        alert('the username has been occupied')
      }
    }
  },
  computed: {
    check: function () {
      return this.username.length >= 6 && this.username.length <= 16 && this.username.match(/^[0-9a-z]+$/)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .box {
  }
  label {
    font-size: 16px;
    color: #333333;
    padding-bottom: 10px;
  }
  input {
    width: 800px;
    height: 36px;
    margin-bottom: 50px;
  }
  button {
    width: 180px;
    height: 52px;
  }
</style>
