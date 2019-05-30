<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
      <div>
        <div class="container">
          <div class="nav-scroller py-1 mb-2">
            <nav class="nav d-flex justify-content-start">
              <div class="my-2 px-2 nav-item-text" @click="current='ctv'">COS to Vesting</div>
              <div class="my-2 px-2 nav-item-text" @click="current='vtc'">Vesting to COS</div>
              <div class="my-2 px-2 nav-item-text" @click="current='cts'">Stake to Stamina</div>
              <div class="my-2 px-2 nav-item-text" @click="current='stc'">Unstake from Stamina</div>
            </nav>
          </div>
        </div>
        <costovesting v-if="current === 'ctv'"></costovesting>
        <vestingtocos v-if="current === 'vtc'"></vestingtocos>
        <costostake v-if="current === 'cts'"></costostake>
        <staketocos v-if="current === 'stc'"></staketocos>
      </div>
    </template>
  </div>
</template>

<script>
import unlock from './Unlock.vue'
import numeric from 'vue-numeric'
import costovesting from './costovesting'
import costostake from './costostake'
import staketocos from './staketocos'
import vestingtocos from './vestingtocos'

const axios = require('axios')

function timestampToDatetime (timestamp) {
  let date = new Date(timestamp * 1000)
  let year = date.getFullYear()
  let month = ('0' + (date.getMonth() + 1)).substr(-2)
  let day = ('0' + date.getDate()).substr(-2)
  let hour = ('0' + date.getHours()).substr(-2)
  let minutes = ('0' + date.getMinutes()).substr(-2)
  let seconds = ('0' + date.getSeconds()).substr(-2)
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
}

export default {
  name: 'Exchange',
  data () {
    return {
      username: this.$store.state.username,
      current: 'ctv'
    }
  },
  components: {
    unlock,
    numeric,
    costovesting,
    costostake,
    staketocos,
    vestingtocos
  },
  async mounted () {
    await this.loadData()
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    }
  },
  watch: {
    ok: 'loadData'
  },
  methods: {
    async loadData () {
      if (!this.ok) return
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
        this.$store.commit('setBalance', r.data.info.coin.value)
        this.$store.commit('setVesting', r.data.info.vest.value)
        this.$store.commit('setStake', r.data.info.stakeVest.value)
        this.$store.commit('setWithdrawEachTime', r.data.info.withdrawEachTime.value)
        this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        let nextWithdraw = r.data.info.nextWithdrawTime.utcSeconds
        if (nextWithdraw > 0) {
          nextWithdraw = timestampToDatetime(nextWithdraw)
        } else {
          nextWithdraw = 'No Waiting Withdraw Request'
        }
        this.$store.commit('setWithdrawRemains', r.data.info.withdrawRemains.value)
        this.$store.commit('setNextWithdraw', nextWithdraw)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .nav-item-text {
    font-size: 1.1rem;
    color: #333;
    &:hover {
      cursor: pointer;
    }
  }
  nav > div + div {
    border-left: 1px solid #aaa;
  }
</style>
