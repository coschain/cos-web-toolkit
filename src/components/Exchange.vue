<template>
  <div>
    <Header></Header>
    <div class="container">
      <div class="box">
        <div class="nav-scroller">
          <nav class="nav d-flex justify-content-start">
            <div class="px-2 nav-item-text" :class="{active: current === 'ctv'}" @click="current='ctv'">COS to Vest</div>
            <div class="px-2 nav-item-text" :class="{active: current === 'vtc'}" @click="current='vtc'">Vest to COS</div>
            <div class="px-2 nav-item-text" :class="{active: current === 'cts'}" @click="current='cts'">COS to Chicken</div>
            <div class="px-2 nav-item-text" :class="{active: current === 'stc'}" @click="current='stc'">Chicken to COS</div>
          </nav>
        </div>
        <costovesting v-if="current === 'ctv'"></costovesting>
        <vestingtocos v-if="current === 'vtc'"></vestingtocos>
        <costostake v-if="current === 'cts'"></costostake>
        <staketocos v-if="current === 'stc'"></staketocos>
      </div>
    </div>
  </div>
</template>

<script>
import numeric from 'vue-numeric'
import costovesting from './costovesting'
import costostake from './costostake'
import staketocos from './staketocos'
import vestingtocos from './vestingtocos'
import Header from './Header'
import {accountInfo} from '../encrypt/clientsign'

export default {
  name: 'Exchange',
  data () {
    return {
      username: this.$store.state.username,
      current: 'ctv'
    }
  },
  components: {
    numeric,
    costovesting,
    costostake,
    staketocos,
    vestingtocos,
    Header
  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      const r = await accountInfo(this.username)
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
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .nav-scroller {
    margin-bottom: 31px;
  }
  .nav-item-text {
    font-size: 18px;
    color: #999999;
    letter-spacing: 0;
    &:hover {
      cursor: pointer;
    }
  }
  nav > div:first-child {
    padding-left: 0 !important;
  }
  nav > div + div {
    border-left: 1px solid #aaa;
  }
</style>
