<template>
  <div>
    <div class="container">
      <div class="box">
        <div class="nav-scroller">
          <nav class="nav d-flex justify-content-start">
            <div class="px-2 nav-item-text" :class="{active: current === 'mnemonic'}" @click="current='mnemonic'">Using
              Mnemonic
            </div>
            <div class="px-2 nav-item-text" :class="{active: current === 'privkey'}" @click="current='privkey'">Using
              Private Key
            </div>
          </nav>
        </div>
      <mnemonic v-if="current === 'mnemonic'" v-on:data="onData"></mnemonic>
      <privkey v-if="current === 'privkey'" v-on:data="onData"></privkey>
      </div>
    </div>
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
      this.$router.push({name: 'ImportSuccess', params: {username: data.username}})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";

  .box {
  }

  .nav-scroller {
    margin-bottom: 42px;
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
