<template>
    <div class="container send py-2">
      <div class="row">
        <div class="col-md-6">
          <label for="from">From Account</label>
          <input type="text" class="form-item disabled" id="from" :value="username" disabled>
        </div>
        <div class="col-md-6">
          <label for="balance">Balance</label>
          <div class="amount">
          <numeric v-bind:precision="6" id="balance" class="disabled" :empty-value="0" v-bind:min="0.000000" v-model="balance" output-type="String" disabled></numeric>
          <div class="symbol">COS</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label for="to">To Account</label>
          <input type="text" class="form-item" id="to" v-model="receiver">
        </div>
        <div class="col-md-6">
          <label for="amount">Value / Amount to Send</label>
          <div class="amount">
              <numeric v-bind:precision="6" id="amount" :empty-value="0" v-bind:min="0.000001" v-model="amount" output-type="String"></numeric>
              <div class="symbol">COS</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <label for="memo">Memo</label>
          <input type="text" class="form-item" id="memo" v-model="memo">
        </div>
      </div>
      <button class="btn btn-block" v-on:click="show=true" :disabled="checkWorking" >
        <span>Generate Transaction</span>
      </button>
      <transfer-confirm v-if="show" @close="closeModal" @confirm="generateTransferTx" v-bind:to="receiver" v-bind:amount="amount" v-bind:working="working"></transfer-confirm>
    </div>

</template>

<script>
import numeric from 'vue-numeric'
import TransferConfirm from './TransferConfirm'
import {transfer} from '../encrypt/clientsign'
import unlock from './Unlock.vue'
const axios = require('axios')

export default {
  name: 'Info',
  data () {
    return {
      privkey: this.$store.state.privkey,
      username: this.$store.state.username,
      receiver: '',
      balance: this.$store.state.balance / 1e6,
      amount: 0,
      working: false,
      memo: '',
      show: false
    }
  },
  components: {
    unlock,
    numeric,
    TransferConfirm
  },
  methods: {
    async generateTransferTx () {
      if (this.balance >= this.amount) {
        this.working = true
        let r = await transfer(this.username, this.receiver, this.amount, this.memo, this.privkey)
        console.log(r)
        if (r.invoice.status === 200) {
          this.balance = parseFloat(this.balance) - parseFloat(this.amount)
          this.receiver = ''
          this.amount = '0.000001'
          this.memo = ''
          this.loadData()
          alert('Transfer Success')
          window.open('http://explorer.contentos.io/#/tx/' + r.invoice.trxId)
        } else {
          alert('generate transfer tx failed')
        }
        this.working = false
      } else {
        alert('balance not enough')
      }
      this.show = false
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
      if (r.data.info && r.data.info.coin && r.data.info.coin.value) {
        // this.balance = r.data.info.coin.value
        this.$store.commit('setBalance', r.data.info.coin.value)
        this.balance = this.$store.state.balance / 1e6
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
