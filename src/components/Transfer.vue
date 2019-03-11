<template>
  <div>
    <unlock v-on:unlocked="onUnlocked" v-on:failed="onFailed"></unlock>
    <template v-if="ok">
      <div class="container send py-2">
        <div class="row">
          <div class="col-md-6">
            <label for="from">From Account</label>
            <input type="text" class="form-item disabled" id="from" :value="username" disabled>
          </div>
          <div class="col-md-6">
            <label for="balance">Balance</label>
            <input type="text" class="form-item disabled" id="balance" v-model="balance" disabled>
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
        <button class="btn btn-block" v-on:click="generateTransferTx">Generate Transaction</button>
      </div>
    </template>
  </div>

</template>

<script>
import numeric from 'vue-numeric'
import {transfer} from '../encrypt/clientsign'
import unlock from './Unlock.vue'

const axios = require('axios')

export default {
  name: 'Info',
  data () {
    return {
      privkey: '',
      username: '',
      receiver: '',
      balance: 0,
      amount: 0,
      memo: ''
    }
  },
  components: {
    unlock,
    numeric
  },
  methods: {
    async generateTransferTx () {
      if (this.balance >= this.amount) {
        let r = await transfer(this.username, this.receiver, this.amount, this.memo, this.privkey)
        console.log(r)
        if (r.invoice.status === 200) {
          alert('success')
        } else {
          alert('generate transfer tx failed')
        }
      } else {
        alert('balance not enough')
      }
    },
    async onUnlocked (unlockedInfo) {
      this.username = unlockedInfo.username
      this.privkey = unlockedInfo.privkey
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/account' : '/v1/account',
        data: {
          name: this.username
        }
      })
      console.log(r)
      if (r.data.coin && r.data.coin.value) {
        this.balance = r.data.coin.value
      }
    },
    onFailed () {
      alert('password incorrect')
    }
  },
  computed: {
    ok () {
      return this.username.length > 0 && this.privkey.length > 0
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
