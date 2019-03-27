<template>
  <div>
    <div class="container">
      <div class="nav-scroller py-1 mb-2">
        <nav class="nav d-flex justify-content-start">
          <div class="my-2 px-2 nav-item-text" @click="current='privkey'">Using Private Key</div>
          <div class="my-2 px-2 nav-item-text" @click="current='keystore'">Using Keystore File</div>
        </nav>
      </div>
    </div>
    <keystore v-if="current === 'keystore'" v-on:data="onData" v-on:failed="onFailed"></keystore>
    <privkey v-if="current === 'privkey'" v-on:data="onData"></privkey>
  </div>
</template>

<script>
import keystore from './InputKeyStore'
import privkey from './InputPrivKey'
export default {
  name: 'Unlock',
  data () {
    return {
      current: 'privkey'
    }
  },
  components: {
    keystore,
    privkey
  },
  methods: {
    onData (data) {
      this.$store.commit('setUsername', data.username)
      this.$store.commit('setPrivkey', data.privkey)
    },
    onFailed (msg) {
      alert('Unlock Failed, Please Enter the correct Password')
    }
  },
  watch: {
    current: function () {
      this.$emit('toggle')
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
