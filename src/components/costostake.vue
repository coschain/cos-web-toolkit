<template>
  <div>
    <div class="container py-2">
      <div class="row py-2" style="margin-bottom: 0">
        <div class="col-md-6">
          <label for="stake">Current Stake Vesting</label>
          <div class="amount">
            <numeric v-bind:precision="6" class="form-control py-3" id="stake" :empty-value="0" v-bind:min="0.000000" :value="stake / 1e6" output-type="String" disabled></numeric>
            <div class="symbol">VEST</div>
          </div>
        </div>
        <div class="col-md-6">
          <label for="stamina">Current Stamina</label>
          <input type="text" class="form-item disabled" id="stamina" :value="stamina" disabled>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-md-6">
          <label for="account">Account</label>
          <input type="text" class="form-item disabled" id="account" :value="username" disabled>
        </div>
        <div class="col-md-6">
          <label for="balance">Balance</label>
          <div class="amount">
            <numeric v-bind:precision="6" id="balance" :empty-value="0" v-bind:min="0.000000" :value="balance / 1e6" output-type="String" disabled></numeric>
            <div class="symbol">COS</div>
          </div>
        </div>
      </div>
      <div class="row py-2">
        <div class="col-md-6">
          <label for="toaccount">To Account</label>
          <input type="text" class="form-item" id="toaccount" v-model="toaccount" required>
        </div>
        <div class="col-md-6">
        <label for="convert">Convert COS</label>
        <div class="amount">
          <numeric v-bind:precision="6" class="form-control py-3" id="convert" :empty-value="0" v-bind:min="0.000001" v-model="converting" output-type="String" required></numeric>
          <div class="symbol">COS</div>
        </div>
          </div>
        </div>
        <button class="btn btn-block" v-on:click="convertCOS" :disabled="!checkConverting">
          <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
          <span v-if="!processing">Convert Cos To Stamina</span>
        </button>
      </div>
  </div>
</template>

<script>
import unlock from './Unlock.vue'
import numeric from 'vue-numeric'
import { VueLoading } from 'vue-loading-template'
import { costostake } from '../encrypt/clientsign'
import { mapState } from 'vuex'

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
      stamina: this.$store.state.stamina,
      toaccount: ''
    }
  },
  methods: {
    async convertCOS () {
      this.processing = true
      let r = await costostake(this.username, this.converting, this.privkey, this.toaccount)
      if (r.invoice.status === 200) {
        this.$store.commit('setBalance', (parseFloat(this.balance) - parseFloat(this.converting) * 1e6))
        this.$store.commit('setStake', (parseFloat(this.stake) + parseFloat(this.converting) * 1e6))
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
      return this.toaccount.length > 0 && parseFloat(this.converting) <= parseFloat(this.balance)
    },
    ...mapState({
      balance: state => state.balance,
      stake: state => state.stake
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
