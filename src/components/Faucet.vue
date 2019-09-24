<template>
  <div>
  <Header></Header>
  <div class="container">
    <div class="box">
    <div class="row">
      <div class="col-md-6">
        <label for="from">Account</label>
        <input type="text" class="form-control" id="from" :value="username" disabled>
      </div>
      <div class="col-md-6">
        <label for="balance">Balance</label>
        <div class="amount">
          <numeric v-bind:precision="6" id="balance" class="form-control" :empty-value="0" v-bind:min="0.000000" v-model="balance" output-type="String" disabled></numeric>
          <div class="symbol">COS</div>
        </div>
      </div>
    </div>
    <button class="btn btn-primary" v-on:click="drip" :disabled="checkWorking">
      <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="working"></vue-loading>
      <span v-if="!working">Get 1 COS From Faucet</span>
    </button>
    <p class="helper py-2">
      The faucet drips 1 COS each time.<br />
      The COS from faucet only can be used on testnet. <br />
      Abusing faucet will impact other developers.
    </p>
  </div>
  </div>
  </div>
</template>

<script>
import unlock from './Unlock.vue'
import Header from './Header'
import numeric from 'vue-numeric'
import { VueLoading } from 'vue-loading-template'

const axios = require('axios')

export default {
  name: 'Faucet',
  data () {
    return {
      username: this.$store.state.username,
      balance: this.$store.state.balance / 1e6,
      working: false
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
        this.balance = this.$store.state.balance / 1e6
      }
    },
    drip: async function () {
      this.working = true
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/drip' : '/v1/drip',
        data: {
          username: this.$store.state.username
        }
      })
      if (r.data.success) {
        this.loadData()
        alert('1 COS dripped')
      } else {
        alert(r.date.msg)
      }
      this.working = false
    }
  },
  components: {
    unlock,
    numeric,
    Header,
    VueLoading
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    },
    checkWorking () {
      return this.working
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
  .box {
    height: 320px;
  }

  label {
    font-size: 16px;
  }
  .helper {
    font-size: 0.8rem;
  }

  .row {
    margin-bottom: 30px;
  }

  div.amount {
    position: relative;
    .symbol {
      font-size: 0.875rem;
      line-height: 3em;
      pointer-events: none;
      position: absolute;
      right: 3px;
      top: 0;
    }
  }
  .btn-primary{
    width: 240px;
    margin-bottom: 20px;
  }
</style>
