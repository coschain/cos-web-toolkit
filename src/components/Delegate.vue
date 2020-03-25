<template>
  <div>
      <div class="row">
        <div class="col-md-6">
          <label for="from">From Account</label>
          <input type="text" class="form-control" id="from" :value="username" disabled>
        </div>
        <div class="col-md-6">
          <label for="balance">Vest Balance</label>
          <div class="amount">
          <numeric v-bind:precision="6" id="balance" class="form-control" :empty-value="0" v-bind:min="0.000000" v-model="balance" output-type="String" disabled></numeric>
          <div class="symbol">VEST</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="to">To Account</label>
          <input type="text" class="form-control" id="to" v-model="receiver">
        </div>
        <div class="col-md-6">
          <label for="amount">Value / Amount to Delegate</label>
          <div class="amount">
              <numeric v-bind:precision="6" id="amount" class="form-control" :empty-value="0" v-bind:min="0.000001" v-model="amount" output-type="String"></numeric>
              <div class="symbol">VEST</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <label for="duration">Delegate duration</label>
          <div class="amount">
              <numeric v-bind:precision="0" id="duration" class="form-control" :empty-value="0" v-bind:min="1" v-model="duration" output-type="String"></numeric>
              <div class="symbol">Sec</div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary" v-on:click="show=true" :disabled="checkWorking" >
        <span>Generate Transaction</span>
      </button>
      <delegate-confirm v-if="show" v-on:close-modal="closeModal" @confirm="generateDelegateTx" v-bind:to="receiver" v-bind:amount="amount" v-bind:duration="duration" v-bind:working="working"></delegate-confirm>
  </div>
</template>

<script>
import numeric from 'vue-numeric'
import DelegateConfirm from './DelegateConfirm'
import {delegate} from '../encrypt/clientsign'
import Header from './Header'
const axios = require('axios')

export default {
  name: 'Info',
  data () {
    return {
      privkey: this.$store.state.privkey,
      username: this.$store.state.username,
      receiver: '',
      balance: this.$store.state.vesting / 1e6,
      amount: 0,
      duration: 0,
      working: false,
      show: false
    }
  },
  components: {
    numeric,
    DelegateConfirm,
    Header
  },
  methods: {
    async generateDelegateTx () {
      if (this.receiver === '') {
        alert('To Account empty')
        return
      }
      if (parseFloat(this.balance) >= parseFloat(this.amount)) {
        this.working = true
        let r = await delegate(this.username, this.receiver, this.amount, this.duration, this.privkey)
        console.log(r)
        if (r.invoice.status === 200) {
          this.balance = parseFloat(this.balance) - parseFloat(this.amount)
          this.receiver = ''
          this.amount = '0.000001'
          this.duration = '1'
          this.loadData()
          alert('Delegate Success')
          window.open('http://explorer.contentos.io/#/tx/' + r.invoice.trxId)
        } else {
          alert('generate delegate tx failed')
        }
      } else {
        alert('balance not enough')
      }
      this.show = false
      this.working = false
    },
    async loadData () {
      if (!this.ok) return
      this.privkey = this.$store.state.privkey
      this.username = this.$store.state.username
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/account' : '/v1/account',
        data: {
          name: this.username
        }
      })
      console.log(r)
      if (r.data.info && r.data.info.vest && r.data.info.vest.value) {
        this.$store.commit('setVesting', r.data.info.vest.value)
        this.balance = this.$store.state.vesting / 1e6
      }
    },
    closeModal: function () {
      this.show = false
    }
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
  }
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
