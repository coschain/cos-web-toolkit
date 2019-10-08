<template>
  <div>
    <Header></Header>
      <div class="container">
        <div class="box">
        <div class="row">
          <div class="col-md-4">
            <label for="caller">Caller</label>
            <input type="text" class="form-control" id="caller" :value="username" disabled>
          </div>
          <div class="col-md-4">
            <label for="balance">balance</label>
            <div class="amount">
              <numeric v-bind:precision="6"  class="form-control" id="balance" :empty-value="0" v-bind:min="0.000000" :value="balance / 1e6" output-type="String" disabled></numeric>
              <div class="symbol">COS</div>
            </div>
          </div>
          <div class="col-md-4">
            <label for="stamina">Stamina</label>
            <input type="text" class="form-control" id="stamina" :value="stamina" disabled>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="contract">Contract</label>
            <input type="text" class="form-control" id="contract" v-model="contract">
          </div>
          <div class="col-md-6">
            <label for="owner">Contract Owner</label>
            <input type="text" class="form-control" id="owner" v-model="owner">
          </div>
        </div>
          <div class="row">
          <div class="col-md-6">
            <label for="method">Method</label>
            <input type="text" class="form-control" id="method" v-model="method">
          </div>
          <div class="col-md-6">
            <label for="payment">Payment</label>
            <div class="amount">
              <numeric v-bind:precision="6" id="payment" class="form-control" :empty-value="0" v-bind:min="0.000000" v-model="payment" output-type="String"></numeric>
              <div class="symbol">COS</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <label for="args">Arguments</label>
            <input type="text" class="form-control" id="args" v-model="args">
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <highlight-code lang="json" id="result">{{ invoice }}</highlight-code>
          </div>
        </div>
        <button class="btn btn-primary" v-on:click="generateContractCallTx" :disabled="!checkParams" >
          <vue-loading type="spin" color="rgba(255,255,255,0.7)" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
          <span v-if="!processing">Generate Transaction</span>
        </button>
      </div>
      </div>
  </div>
</template>

<script>
import Header from './Header'
import { VueLoading } from 'vue-loading-template'
import { mapState } from 'vuex'
import {contractcall} from '../encrypt/clientsign'
import numeric from 'vue-numeric'
const axios = require('axios')

export default {
  name: 'Contract',
  data () {
    return {
      processing: false,
      contract: '',
      owner: '',
      method: '',
      payment: '0.000000',
      args: '',
      invoice: {}
    }
  },
  components: {
    numeric,
    VueLoading,
    Header
  },
  methods: {
    async loadData () {
      if (!this.ok) return
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
        this.$store.commit('setVesting', r.data.info.vest.value)
        this.$store.commit('setStamina', r.data.info.staminaFreeRemain + r.data.info.staminaStakeRemain)
        this.$store.commit('setStake', r.data.info.stakeVestForMe.value)
        this.$store.commit('setWithdrawEachTime', r.data.info.withdrawEachTime.value)
        this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        this.$store.commit('setNextWithdraw', r.data.info.nextWithdrawTime.utcSeconds)
      }
    },
    async generateContractCallTx () {
      this.processing = true
      let privkey = this.$store.state.privkey
      let r = await contractcall(this.username, this.owner, this.contract, this.method, this.args, privkey, this.payment)
      console.log(r)
      if (r && r.invoice) {
        this.invoice = r.invoice
        this.loadData()
        if (r.invoice.status === 200) {
          alert('call method success')
        } else {
          alert('generate transfer tx failed')
        }
      } else {
        alert('generate transfer tx failed')
      }
      this.processing = false
    }
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    },
    checkParams () {
      return this.owner.length > 0 && this.contract.length > 0 && this.method.length > 0 && this.args.length > 0
    },
    ...mapState({
      stamina: state => state.stamina,
      username: state => state.username,
      balance: state => state.balance
    })
  },
  filters: {
    pretty: function (value) {
      return JSON.stringify(value, null, 2)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";

  .row {
    margin-bottom: 26px;
  }

  label {
    font-size: 16px;
  }

  .btn {
    width: 240px;
  }

</style>
