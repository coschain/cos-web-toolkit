<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <label for="current">Current Vest</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="current" :empty-value="0" v-bind:min="0.000000"
                   :value="vesting / 1e6" output-type="String" disabled></numeric>
          <div class="symbol">VEST</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <label for="remain">Remain Vest Waiting Conversion</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="remain" :empty-value="0" v-bind:min="0.000000"
                   :value="withdrawRemains / 1e6" output-type="String" disabled></numeric>
          <div class="symbol">VEST</div>
        </div>
      </div>
      <div class="col-md-6">
        <label for="eachtime">Each Time To Convert</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="eachtime" :empty-value="0" v-bind:min="0.000000"
                   :value="withdrawEachTime / 1e6" output-type="String" disabled></numeric>
          <div class="symbol">VEST</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <label for="next">Next Convert Datetime</label>
        <input type="text" class="form-control" id="next" :value="nextWithdraw" disabled>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <label for="account">Account</label>
        <input type="text" class="form-control" id="account" :value="username" disabled>
      </div>
      <div class="col-md-6">
        <label for="balance">Balance</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="balance" :empty-value="0" v-bind:min="0.000000"
                   :value="balance / 1e6" output-type="String" disabled></numeric>
          <div class="symbol">COS</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <label for="convert">Convert Vest</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="convert" :empty-value="0.000001"
                   v-bind:min="0.000001" v-model="converting" output-type="String" required></numeric>
          <div class="symbol">VEST</div>
        </div>
      </div>
    </div>
    <template v-if="!this.$store.state.extensionOn">
      <button class="btn btn-primary" v-on:click="convertCOS" :disabled="!checkConverting">
        <vue-loading type="spin" color="rgba(255,255,255,0.7)" :size="{ width: '30px', height: '30px' }"
                     v-if="processing"></vue-loading>
        <span v-if="!processing">Convert Vest To COS</span>
      </button>
    </template>
    <template v-if="this.$store.state.extensionOn">
      <cos-unvest class="btn btn-primary" v-bind:amount="converting" text="Convert Vest To Cos" v-on:result="resultHandler" v-on:error="errorHandler"></cos-unvest>
    </template>
  </div>
</template>

<script>
import numeric from 'vue-numeric'
import {VueLoading} from 'vue-loading-template'
import {vestingtocos} from '../encrypt/clientsign'
import {mapState} from 'vuex'

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
      converting: '0'
      // vesting: this.$store.state.vesting / 1e6,
      // remainsVesting: this.$store.state.withdrawRemains / 1e6,
      // eachTimeVesting: this.$store.state.withdrawEachTime / 1e6,
      // nextWithdraw: this.$store.state.nextWithdraw
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
        this.$store.commit('setStake', r.data.info.stakeVestForMe.value)
        // this.$store.commit('setStamina', r.data.info.staminaFreeRemain + r.data.info.staminaStakeRemain)
        this.$store.commit('setWithdrawEachTime', r.data.info.withdrawEachTime.value)
        this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        this.$store.commit('setNextWithdraw', r.data.info.nextWithdrawTime.utcSeconds)
      }
    },
    async convertCOS () {
      this.processing = true
      let r = await vestingtocos(this.username, this.converting, this.privkey)
      if (r && r.invoice.status === 200) {
        await this.loadData()
        alert('Convert Success')
      } else {
        alert('Convert failed')
      }
      this.converting = '0.000001'
      this.processing = false
    },
    async resultHandler (result) {
      await this.loadData()
      alert('Convert Success')
      this.converting = '0.000001'
    },
    async errorHandler (exception) {
      alert('Convert failed')
      this.converting = '0.000001'
    }
  },
  components: {
    numeric,
    VueLoading
  },
  computed: {
    checkConverting () {
      return parseFloat(this.converting) >= 1 && parseFloat(this.converting) <= parseFloat(this.vesting) / 1e6
    },
    ...mapState({
      balance: state => state.balance,
      vesting: state => state.vesting,
      withdrawRemains: state => state.withdrawRemains,
      withdrawEachTime: state => state.withdrawEachTime,
      nextWithdraw (state) {
        let nextWithdrawTime = state.nextWithdraw
        if (nextWithdrawTime > 0) {
          return timestampToDatetime(nextWithdrawTime)
        } else {
          return 'No Waiting Withdraw Request'
        }
      }
    })
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
    margin-top: 50px;
  }
</style>
