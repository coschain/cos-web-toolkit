<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
      <div class="container py-2">
        <div class="row">
          <div class="col-md-6">
            <label for="from">Account</label>
            <input type="text" class="form-item disabled" id="from" :value="username" disabled>
          </div>
          <div class="col-md-6">
            <label for="balance">Balance</label>
            <input type="text" class="form-item disabled" id="balance" v-model="balance" disabled>
          </div>
        </div>
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
  data () {
    return {
      username: this.$store.state.username,
      balance: this.$store.state.balance
    }
  },
  methods: {
    async loadData () {
      if (!this.ok) return
      this.username = this.$store.state.username
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/account' : '/v1/account',
        data: {
          name: this.username
        }
      })
      console.log(r)
      if (r.data.info && r.data.info.coin && r.data.info.coin.value) {
        this.$store.commit('setBalance', r.data.info.coin.value)
        this.balance = this.$store.state.balance
      }
    },
    drip: async function () {
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/drip' : '/v1/drip',
        data: {
          username: this.$store.state.username
        }
      })
      if (r.data.success) {
        await this.loadData()
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
  },
  watch: {
    ok: function () {
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .row {
    margin-bottom: 0.8rem;
  }

  .disabled {
    background-color: #e9ecef;
  }

  label {
    font-size: 1.2rem;
  }

  input {
    background-color: #f5f5f5;
    border-radius: 3px;
    box-shadow: none;
    width: 100%;
    color: #565656;
    font-size: 0.875rem;
    line-height: 1.43;
    min-height: 3em;
    padding: 0.2em 1.07em 0.2em;
    border: 1px solid #e8e8e8;

    &:focus {
      outline: none;
    }
  }
  .helper {
    font-size: 0.8rem;
  }
</style>
