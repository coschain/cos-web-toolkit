<template>
  <div>
  <Header></Header>
  <div class="container">
    <div class="box">
    <div class="row">
      <div class="col-md-12">
        <h4>Overview</h4>
        <table class="table pt-2">
          <tr>
            <td>AccountName</td>
            <td>{{ name }}</td>
          </tr>
          <tr>
            <td>Public Key</td>
            <td>{{ pubkey }}</td>
          </tr>
          <tr>
            <td>Balance</td>
            <td>
              <div class="amount">
                <numeric v-bind:precision="6" class="numeric" :value="balance / 1e6" output-type="String" disabled></numeric>
                <span class="symbol">COS</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>Vest</td>
            <td>
              <div class="amount">
                <numeric v-bind:precision="6" class="numeric" :value="vest / 1e6" output-type="String" disabled></numeric>
                <span class="symbol">VEST</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>Chicken</td>
            <td>
              <div class="amount">
                <numeric v-bind:precision="6" class="numeric" :value="stake / 1e6" output-type="String" disabled></numeric>
                <span class="symbol">COS</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>Stamina</td>
            <td>{{ stamina }}</td>
          </tr>
          <tr>
            <td>Vest Borrowed</td>
            <td>
              <div class="amount">
                <numeric v-bind:precision="6" class="numeric" :value="vest_borrowed / 1e6" output-type="String" disabled></numeric>
                <span class="symbol">VEST</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>Vest Lent</td>
            <td>
              <div class="amount">
                <numeric v-bind:precision="6" class="numeric" :value="vest_lent / 1e6" output-type="String" disabled></numeric>
                <span class="symbol">VEST</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>Vest Delivering</td>
            <td>
              <div class="amount">
                <numeric v-bind:precision="6" class="numeric" :value="vest_delivering / 1e6" output-type="String" disabled></numeric>
                <span class="symbol">VEST</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import numeric from 'vue-numeric'
import {accountInfo} from '../encrypt/clientsign'
import Header from './Header'
const {crypto} = require('cos-grpc-js')
export default {
  name: 'Account',
  data () {
    return {
      name: this.$store.state.username
    }
  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    loadData: async function () {
      const username = this.$store.state.username
      const r = await accountInfo(username)
      if (r.info) {
        this.$store.commit('setBalance', r.info.coin.value)
        this.$store.commit('setVesting', r.info.vest.value)
        this.$store.commit('setStamina', r.info.staminaFreeRemain + r.info.staminaStakeRemain)
        this.$store.commit('setStake', r.info.stakeVestForMe.value)
        this.$store.commit('setWithdrawEachTime', r.info.withdrawEachTime.value)
        this.$store.commit('setWithdrawRemains', r.info.withdrawRemains.value)
        this.$store.commit('setNextWithdraw', r.info.nextWithdrawTime.utcSeconds)
        this.$store.commit('setBorrowedVest', r.info.vestBorrowed.value)
        this.$store.commit('setLentVest', r.info.vestLent.value)
        this.$store.commit('setDeliveringVest', r.info.vestDelivering.value)
      }
    }
  },
  computed: {
    ...mapState({
      balance: state => state.balance,
      stake: state => state.stake,
      stamina: state => state.stamina,
      vest: state => state.vesting,
      vest_borrowed: state => state.BorrowedVest,
      vest_lent: state => state.LentVest,
      vest_delivering: state => state.DeliveringVest
    }),
    pubkey: function () {
      let priv = crypto.privKeyFromWIF(this.$store.state.privkey)
      let pub = priv.pubKey()
      return pub.toWIF()
    }
  },
  components: {
    numeric,
    Header
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  h4 {
    font-size: 18px;
    margin-bottom: 15px;
  }
  .numeric {
    border: none;
  }
  td {
    font-size: 14px;
  }
  div.amount {
    position: relative;
    .symbol {
      font-size: 0.875rem;
      pointer-events: none;
    }
  }
</style>
