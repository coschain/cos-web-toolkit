<template>
  <div>
    <h1>Create New Account</h1>
    <h3>with this public key</h3>
    <p>{{ pubkey }}</p>
    <input v-model="username" placeholder="username">
    <button :disabled="!checkUsername(username)" v-on:click="createAccount">submit</button>
    <p>{{ result }}</p>
  </div>
</template>

<script>

const axios = require('axios')

export default {
  name: 'Create',
  props: ['pubkey'],
  data () {
    return {
      username: '',
      result: ''
    }
  },
  methods: {
    createAccount: async function () {
      await axios({
        method: 'post',
        url: 'http://localhost:3000/v1/create_account',
        data: {
          username: this.username,
          pubkey: this.pubkey
        }
      })
    },
    checkUsername: (name) => {
      if (!name) {
        return false
      }
      if (name.length < 6 || name.length > 16) {
        return false
      }
      return name.match(/^[A-Za-z0-9]+$/i) !== null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
