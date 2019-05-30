<template>
  <div>
    <div class="container py-2">
      <div class="py-2">
        <label for="current">Current Vesting</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control py-3" id="current" :empty-value="0" v-bind:min="0.000000" :value="vesting / 1e6" output-type="String" disabled></numeric>
          <div class="symbol">VEST</div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-md-6">
          <label for="remain">Remain Vesting Waiting Conversion</label>
          <div class="amount">
            <numeric v-bind:precision="6" id="remain" :empty-value="0" v-bind:min="0.000000" :value="withdrawRemains / 1e6" output-type="String" disabled></numeric>
            <div class="symbol">VEST</div>
          </div>
        </div>
        <div class="col-md-6">
          <label for="eachtime">Each Time To Convert</label>
          <div class="amount">
            <numeric v-bind:precision="6" id="eachtime" :empty-value="0" v-bind:min="0.000000" :value="withdrawEachTime / 1e6" output-type="String" disabled></numeric>
            <div class="symbol">VEST</div>
          </div>
        </div>
      </div>
      <div class="py-2">
        <label for="next">Next Convert Datetime</label>
        <input type="text" class="form-item disabled" id="next" :value="nextWithdraw" disabled>
      </div>
      <div class="row py-2">
        <div class="col-md-6">
          <label for="account">Account</label>
          <input type="text" class="form-item disabled" id="account" :value="username" disabled>
        </div>
        <div class="col-md-6">
          <label for="balance">Balance</label>
          <div class="amount">
            <numeric v-bind:precision="6" id="balance" :empty-value="0" v-bind:min="0.000000" :value="balance" output-type="String" disabled></numeric>
            <div class="symbol">COS</div>
          </div>
        </div>
      </div>
      <div class="py-2">
        <label for="convert">Convert Vesting</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control py-3" id="convert" :empty-value="0.000001" v-bind:min="0.000001" v-model="converting" output-type="String" required></numeric>
          <div class="symbol">Vest</div>
        </div>
      </div>
      <button class="btn btn-block" v-on:click="convertCOS" :disabled="!checkConverting">
        <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
        <span v-if="!processing">Convert Vesting To COS</span>
      </button>
    </div>
  </div>
</template>

<script>
import unlock from './Unlock.vue'
import numeric from 'vue-numeric'
import { VueLoading } from 'vue-loading-template'
import {vestingtocos} from '../encrypt/clientsign'
import { mapState } from 'vuex'

const axios = require('axios')

function timestampToDatetime (timestamp) {
  let date = new Date(timestamp * 1000)
  let year = date.getFullYear()
  let month = ('0' + (date.getMonth() + 1)).substr(-2)
  let day = ('0' + date.getDate()).substr(-2)
  let hour = ('0' + date.getHours()).substr(-2)
  let minutes = ('0' + date.getMinutes()).substr(-2)
  let seconds = ('0' + date.getSeconds()).substr(-2)
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
}

export default {
  name: 'VestingToCos',
  data () {
    return {
      username: this.$store.state.username,
      privkey: this.$store.state.privkey,
      // balance: this.$store.state.balance / 1e6,
      processing: false,
      converting: 0,
      // vesting: this.$store.state.vesting / 1e6,
      // remainsVesting: this.$store.state.withdrawRemains / 1e6,
      // eachTimeVesting: this.$store.state.withdrawEachTime / 1e6,
      nextWithdraw: this.$store.state.nextWithdraw
    }
  },
  methods: {
    async loadData () {
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
        this.$store.commit('setVesting', r.data.info.vest.value)
        this.$store.commit('setStake', r.data.info.stakeVest.value)
        this.$store.commit('setWithdrawEachTime', r.data.info.withdrawEachTime.value)
        this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        let nextWithdraw = r.data.info.nextWithdrawTime.utcSeconds
        if (nextWithdraw > 0) {
          nextWithdraw = timestampToDatetime(nextWithdraw)
        } else {
          nextWithdraw = 'No Waiting Withdraw Request'
        }
        this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        this.$store.commit('setNextWithdraw', nextWithdraw)
      }
    },
    async convertCOS () {
      this.processing = true
      let r = await vestingtocos(this.username, this.converting, this.privkey)
      if (r.invoice.status === 200) {
        // this.$store.commit('setBalance', this.balance)
        // this.$store.commit('setVesting', this.vesting)
        await this.loadData()
        alert('Convert Success')
      } else {
        alert('Convert failed')
      }
      this.converting = '0.000001'
      this.processing = false
    }
  },
  components: {
    unlock,
    numeric,
    VueLoading
  },
  computed: {
    checkConverting () {
      return parseFloat(this.converting) <= parseFloat(this.balance)
    },
    ...mapState({
      balance: state => state.balance,
      vesting: state => state.vesting,
      withdrawRemains: state => state.withdrawRemains,
      withdrawEachTime: state => state.withdrawEachTime
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .row {
    margin-bottom: 0;
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
