<template>
  <div>
    <Header></Header>
    <div class="container">
      <div class="box">
        <div class="nav-scroller">
          <nav class="nav d-flex justify-content-start">
            <div class="px-2 nav-item-text" :class="{active: current === 'delegate_vest'}" @click="current='delegate_vest'">Delegate</div>
            <div class="px-2 nav-item-text" :class="{active: current === 'un_delegate_vest'}" @click="current='un_delegate_vest'">UnDelegate</div>
          </nav>
        </div>
        <delegate v-if="current === 'delegate_vest'"></delegate>
        <unDelegate v-if="current === 'un_delegate_vest'"></unDelegate>
      </div>
    </div>
  </div>
</template>

<script>
import numeric from 'vue-numeric'
import Delegate from './Delegate'
import UnDelegate from './UnDelegate'
import Header from './Header'
import {accountInfo} from '../encrypt/clientsign'

export default {
  name: 'Delegation',
  data () {
    return {
      username: this.$store.state.username,
      current: 'delegate_vest'
    }
  },
  components: {
    numeric,
    Delegate,
    UnDelegate,
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
