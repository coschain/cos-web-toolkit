<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <label for="current">Current Vest</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="current" :empty-value="0" v-bind:min="0.000000" :value="vesting / 1e6" output-type="String" disabled></numeric>
          <div class="symbol">VEST</div>
        </div>
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
      <div class="col-md-12">
        <label for="convert">Convert COS</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control" id="convert" :empty-value="0" v-bind:min="0.000001" v-model="converting" output-type="String" required></numeric>
          <div class="symbol">COS</div>
        </div>
      </div>
    </div>
    <template v-if="!this.$store.state.extensionOn">
      <button class="btn btn-primary" v-on:click="convertCOS" :disabled="!checkConverting">
        <vue-loading type="spin" color="rgba(255,255,255,0.7)" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
        <span v-if="!processing">Convert Cos To Vest</span>
      </button>
    </template>
    <template v-if="this.$store.state.extensionOn">
      <cos-vest class="btn btn-primary" v-bind:amount="converting" text="Convert Cos To Vest" v-on:result="resultHandler" v-on:error="errorHandler"></cos-vest>
    </template>
  </div>
</template>

<script>
import numeric from 'vue-numeric'
import { VueLoading } from 'vue-loading-template'
import {costovesting} from '../encrypt/clientsign'
import { mapState } from 'vuex'

export default {
  name: 'CosToVesting',
  data () {
    return {
      username: this.$store.state.username,
      privkey: this.$store.state.privkey,
      processing: false,
      converting: '0'
    }
  },
  methods: {
    async convertCOS () {
      this.processing = true
      let r = await costovesting(this.username, this.converting, this.privkey)
      if (r.invoice.status === 200) {
        this.$store.commit('setBalance', (parseFloat(this.balance) - parseFloat(this.converting) * 1e6))
        this.$store.commit('setVesting', (parseFloat(this.vesting) + parseFloat(this.converting) * 1e6))
        alert('Convert Success')
      } else {
        alert('Convert failed')
      }
      this.converting = '0.000001'
      this.processing = false
    },
    resultHandler (result) {
      this.$store.commit('setBalance', (parseFloat(this.balance) - parseFloat(this.converting) * 1e6))
      this.$store.commit('setVesting', (parseFloat(this.vesting) + parseFloat(this.converting) * 1e6))
      this.converting = '0.000001'
      alert('Convert Success')
    },
    errorHandler (exception) {
      this.converting = '0.000001'
      alert('Convert failed')
    }
  },
  components: {
    numeric,
    VueLoading
  },
  computed: {
    checkConverting () {
      return parseFloat(this.converting) <= parseFloat(this.balance) / 1e6
    },
    ...mapState({
      balance: state => state.balance,
      vesting: state => state.vesting
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
