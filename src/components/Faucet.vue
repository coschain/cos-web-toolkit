<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
      <div class="container py-2">
        <button class="btn btn-block" v-on:click="drip">Get 1 COS From Faucet</button>
        <p class="helper py-2">
          The faucet drips 1 COS each time.<br />
          The COS from faucet only can be used on testnet. <br />
          Abusing faucet will impact other developers.
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import unlock from './Unlock.vue'

const axios = require('axios')

export default {
  name: 'Faucet',
  methods: {
    drip: async function () {
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/drip' : '/v1/drip',
        data: {
          username: this.$store.state.username
        }
      })
      if (r.data.success) {
        alert('1 COS dripped')
      } else {
        alert(r.date.msg)
      }
    }
  },
  components: {
    unlock
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .helper {
    font-size: 0.8rem;
  }
</style>
