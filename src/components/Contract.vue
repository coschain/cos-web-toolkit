<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
      <div class="container send py-2">
        <div class="row">
          <div class="col-md-4">
            <label for="caller">Caller</label>
            <input type="text" class="form-item disabled" id="caller" :value="username" disabled>
          </div>
          <div class="col-md-4">
            <label for="balance">balance</label>
            <div class="amount">
              <numeric v-bind:precision="6"  class="form-control py-3 disabled" id="balance" :empty-value="0" v-bind:min="0.000000" :value="balance / 1e6" output-type="String" disabled></numeric>
              <div class="symbol">COS</div>
            </div>
          </div>
          <div class="col-md-4">
            <label for="stamina">Stamina</label>
            <input type="text" class="form-item disabled" id="stamina" :value="stamina" disabled>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="contract">Contract</label>
            <input type="text" class="form-item" id="contract" v-model="contract">
          </div>
          <div class="col-md-6">
            <label for="owner">Contract Owner</label>
            <input type="text" class="form-item" id="owner" v-model="owner">
          </div>
          <div class="col-md-6 py-1">
            <label for="method">Method</label>
            <input type="text" class="form-item" id="method" v-model="method">
          </div>
          <div class="col-md-6 py-1">
            <label for="payment">Payment</label>
            <div class="amount">
              <numeric v-bind:precision="6" id="payment" :empty-value="0" v-bind:min="0.000000" v-model="payment" output-type="String"></numeric>
              <div class="symbol">COS</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <label for="args">Arguments</label>
            <input type="text" class="form-item" id="args" v-model="args">
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
<!--            <label for="result">Result</label>-->
<!--            <pre id="result"><code class="json">{{ invoice | pretty }}</code></pre>-->
<!--            <pre v-highlightjs><code class="json">{{ invoice }}</code></pre>-->
            <highlight-code lang="json" id="result">{{ invoice }}</highlight-code>
          </div>
        </div>
        <button class="btn btn-block" v-on:click="generateContractCallTx" :disabled="!checkParams" >
          <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
          <span v-if="!processing">Generate Transaction</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import unlock from './Unlock.vue'
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
    unlock,
    numeric,
    VueLoading
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
        this.$store.commit('setStake', r.data.info.stakeVest.value)
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
      if (r && r.invoice && r.invoice.status === 200) {
        this.invoice = r.invoice
        this.loadData()
        alert('call method success')
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
</style>
