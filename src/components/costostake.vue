<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <label for="stake">Current Chicken</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="stake" :empty-value="0"
                   v-bind:min="0.000000" :value="stake / 1e6" output-type="String" disabled></numeric>
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
          <numeric v-bind:precision="6" class="form-control" id="balance" :empty-value="0" v-bind:min="0.000000"
                   :value="balance / 1e6" output-type="String" disabled></numeric>
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
        <label for="convert">Convert COS</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="convert" :empty-value="0" v-bind:min="0.000001"
                   v-model="converting" output-type="String" required></numeric>
          <div class="symbol">COS</div>
        </div>
      </div>
    </div>
    <button class="btn btn-primary" v-on:click="convertCOS" :disabled="!checkConverting">
      <vue-loading type="spin" color="rgba(255, 255, 255, 0.7)" :size="{ width: '30px', height: '30px' }"
                   v-if="processing"></vue-loading>
      <span v-if="!processing">Convert Cos To Chicken</span>
    </button>
  </div>
</template>

<script>
import numeric from 'vue-numeric'
import {VueLoading} from 'vue-loading-template'
import {costostake} from '../encrypt/clientsign'
import {mapState} from 'vuex'

const axios = require('axios')

export default {
  name: 'CosToStake',
  data () {
    return {
      username: this.$store.state.username,
      privkey: this.$store.state.privkey,
      // balance: this.$store.state.balance / 1e6,
      processing: false,
      converting: 0,
      // stake: this.$store.state.stake / 1e6,
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
      }
    },
    async convertCOS () {
      this.processing = true
      let r = await costostake(this.username, this.converting, this.privkey, this.toaccount)
      if (r && r.invoice && r.invoice.status === 200) {
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
    numeric,
    VueLoading
  },
  computed: {
    checkConverting () {
      return this.toaccount.length > 0 && parseFloat(this.converting) <= parseFloat(this.balance) / 1e6
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
