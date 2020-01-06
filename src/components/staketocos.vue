<template>
  <div>
      <div class="row">
        <div class="col-md-6">
          <label for="stake">Current Chicken</label>
          <div class="amount">
            <numeric v-bind:precision="6" class="form-control" id="stake" :empty-value="0" v-bind:min="0.000000" :value="stake / 1e6" output-type="String" disabled></numeric>
            <div class="symbol">VEST</div>
          </div>
        </div>
        <div class="col-md-6">
          <label for="stamina">Current Stamina</label>
          <input type="text" class="form-control" id="stamina" :value="stamina" disabled>
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
            <numeric v-bind:precision="6" class="form-control" id="balance" :empty-value="0" v-bind:min="0.000000" :value="balance / 1e6" output-type="String" disabled></numeric>
            <div class="symbol">COS</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="toaccount">To Account</label>
          <input type="text" class="form-control" id="toaccount" v-model="toaccount" required>
        </div>
        <div class="col-md-6">
          <label for="convert">Convert Chicken To COS</label>
          <div class="amount">
            <numeric v-bind:precision="6" class="form-control" id="convert" :empty-value="0" v-bind:min="0.000001" v-model="converting" output-type="String" required></numeric>
            <div class="symbol">VEST</div>
          </div>
        </div>
      </div>
    <template v-if="!this.$store.state.extensionOn">
      <button class="btn btn-primary" v-on:click="convertStake" :disabled="!checkConverting">
        <vue-loading type="spin" color="rgba(255,255,255,0.7)" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
        <span v-if="!processing">Convert Chicken To COS</span>
      </button>
    </template>
    <template v-if="this.$store.state.extensionOn">
      <cos-unchicken class="btn btn-primary" v-bind:amount="converting" v-bind:receiver="toaccount" text="Convert Chicken To Cos" v-on:result="resultHandler" v-on:error="errorHandler"></cos-unchicken>
    </template>
  </div>
</template>

<script>
import numeric from 'vue-numeric'
import { VueLoading } from 'vue-loading-template'
import { staketocos } from '../encrypt/clientsign'
import { mapState } from 'vuex'

const axios = require('axios')

export default {
  name: 'CosToStake',
  data () {
    return {
      username: this.$store.state.username,
      privkey: this.$store.state.privkey,
      // balance: this.$store.state.balance,
      processing: false,
      converting: '0',
      // stake: this.$store.state.stake,
      // stamina: this.$store.state.stamina,
      toaccount: ''
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
        this.$store.commit('setStamina', r.data.info.staminaFreeRemain + r.data.info.staminaStakeRemain)
        // this.$store.commit('setWithdrawEachTime', r.data.info.withdrawEachTime.value)
        // this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        // this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        // this.$store.commit('setNextWithdraw', r.data.info.nextWithdrawTime.utcSeconds)
      }
    },
    async convertStake () {
      this.processing = true
      let r = await staketocos(this.username, this.converting, this.privkey, this.toaccount)
      if (r.invoice.status === 200) {
        await this.loadData()
        // this.$store.commit('setBalance', (parseFloat(this.balance) - parseFloat(this.converting) * 1e6))
        // this.$store.commit('setStake', (parseFloat(this.stake) + parseFloat(this.converting) * 1e6))
        alert('Convert Success')
      } else if (r.invoice.status === 201) {
        alert('Can not unstake when freezing')
      } else {
        alert('Convert failed')
      }
      this.converting = '0.000001'
      this.processing = false
    },
    async resultHandler (result) {
      if (result && result.invoice && result.invoice.status !== 200) {
        alert('Can not unstake when freezing')
      } else {
        await this.loadData()
        alert('Convert Success')
      }
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
      return this.toaccount.length > 0 && parseFloat(this.converting) <= parseFloat(this.stake) / 1e6
    },
    ...mapState({
      balance: state => state.balance,
      stake: state => state.stake,
      stamina: state => state.stamina
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
