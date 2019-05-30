<template>
  <div>
    <div class="container py-2">
      <div class="py-2">
        <label for="current">Current Vesting</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control py-3" id="current" :empty-value="0" v-bind:min="0.000000" v-model="vesting" output-type="String" disabled></numeric>
          <div class="symbol">VEST</div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-md-6">
          <label for="remain">Remain Vesting Waiting Conversion</label>
          <div class="amount">
            <numeric v-bind:precision="6" id="remain" :empty-value="0" v-bind:min="0.000000" v-model="remainsVesting" output-type="String" disabled></numeric>
            <div class="symbol">VEST</div>
          </div>
        </div>
        <div class="col-md-6">
          <label for="eachtime">Each Time To Convert</label>
          <div class="amount">
            <numeric v-bind:precision="6" id="eachtime" :empty-value="0" v-bind:min="0.000000" v-model="eachTimeVesting" output-type="String" disabled></numeric>
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
            <numeric v-bind:precision="6" id="balance" :empty-value="0" v-bind:min="0.000000" v-model="balance" output-type="String" disabled></numeric>
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

export default {
  name: 'VestingToCos',
  data () {
    return {
      username: this.$store.state.username,
      privkey: this.$store.state.privkey,
      balance: this.$store.state.balance / 1e6,
      processing: false,
      converting: 0,
      vesting: this.$store.state.vesting / 1e6,
      remainsVesting: this.$store.state.withdrawRemains / 1e6,
      eachTimeVesting: this.$store.state.withdrawEachTime / 1e6,
      nextWithdraw: this.$store.state.nextWithdraw
    }
  },
  methods: {
    async convertCOS () {
      this.processing = true
      let r = await vestingtocos(this.username, this.converting, this.privkey)
      if (r.invoice.status === 200) {
        this.converting = '0.000001'
        this.$store.commit('setBalance', this.balance)
        this.$store.commit('setVesting', this.vesting)
        alert('Convert Success')
      } else {
        alert('Convert failed')
      }
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
    }
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
