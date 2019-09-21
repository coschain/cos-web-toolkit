<template>
  <div class="container py-2">
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
            <td>Stake</td>
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
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import numeric from 'vue-numeric'
import {accountInfo} from '../encrypt/clientsign'
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
      }
    }
  },
  computed: {
    ...mapState({
      balance: state => state.balance,
      stake: state => state.stake,
      stamina: state => state.stamina,
      vest: state => state.vesting
    }),
    pubkey: function () {
      let priv = crypto.privKeyFromWIF(this.$store.state.privkey)
      let pub = priv.pubKey()
      return pub.toWIF()
    }
  },
  components: {
    numeric
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .numeric {
    border: none;
  }
  div.amount {
    position: relative;
    .symbol {
      font-size: 0.875rem;
      pointer-events: none;
    }
  }
</style>
