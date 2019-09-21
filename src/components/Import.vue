<template>
  <div>
    <div class="container">
      <div class="nav-scroller py-1 mb-2">
        <nav class="nav d-flex justify-content-start">
          <div class="my-2 px-2 nav-item-text" @click="current='mnemonic'">Using Mnemonic</div>
          <div class="my-2 px-2 nav-item-text" @click="current='privkey'">Using Private Key</div>
        </nav>
      </div>
    </div>
    <mnemonic v-if="current === 'mnemonic'" v-on:data="onData"></mnemonic>
    <privkey v-if="current === 'privkey'" v-on:data="onData"></privkey>
  </div>
</template>

<script>
import privkey from './InputPrivKey'
import mnemonic from './InputMnemonic'
export default {
  name: 'Import',
  data () {
    return {
      current: 'mnemonic'
    }
  },
  components: {
    privkey,
    mnemonic
  },
  methods: {
    onData (data) {
      this.$store.commit('setUsername', data.username)
      this.$store.commit('setPrivkey', data.privkey)
      this.$store.commit('setBalance', data.balance)
      this.$store.commit('setVesting', data.vesting)
      this.$store.commit('setStake', data.stake)
      this.$store.commit('setStamina', data.stamina)
      this.$router.push({name: 'ImportSuccess', params: { username: data.username }})
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
