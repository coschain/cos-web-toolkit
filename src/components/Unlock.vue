<template>
  <div>
    <privkey v-on:data="onData"></privkey>
  </div>
</template>

<script>
import privkey from './InputPrivKey'
export default {
  name: 'Unlock',
  data () {
    return {
      current: 'privkey'
    }
  },
  components: {
    privkey
  },
  methods: {
    onData (data) {
      this.$store.commit('setUsername', data.username)
      this.$store.commit('setPrivkey', data.privkey)
      this.$store.commit('setBalance', data.balance)
      this.$store.commit('setVesting', data.vesting)
      this.$store.commit('setStake', data.stake)
    }
  }
}
</script>

<style lang="scss" scoped>
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
