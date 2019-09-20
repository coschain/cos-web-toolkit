<template>
  <div>
    <div class="container">
      <h4 class="pt-2">Make Sure You Have Saved</h4>
      <div class="nav-scroller py-1 mb-2">
        <nav class="nav d-flex justify-content-start">
          <div class="my-2 px-2 nav-item-text" @click="current='mnemonic'">Verify Mnemonic</div>
          <div class="my-2 px-2 nav-item-text" @click="current='privkey'">Verify Private Key</div>
        </nav>
      </div>
    <template v-if="current === 'mnemonic'">
      <label for="m-input" class="py-2">Input Generated Mnemonic:</label>
      <input type="text" class="form-control py-3" id="m-input" placeholder="Do NOT input in public" v-model="input_mnemonic" required>
      <button class="btn btn-block" v-on:click="verify_mnemonic">Verify</button>
    </template>
    <template v-if="current === 'privkey'">
      <label for="p-input" class="py-2">Input Generated Private Key:</label>
      <input type="text" class="form-control py-3" id="p-input" placeholder="Do NOT input in public" v-model="input_privkey" required>
      <button class="btn btn-block" v-on:click="verify_privkey">Verify</button>
    </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoubleCheck',
  props: ['mnemonic', 'privateKey'],
  data () {
    return {
      input_mnemonic: '',
      input_privkey: '',
      current: 'mnemonic'
    }
  },
  methods: {
    verify_mnemonic: async function () {
      if (this.input_mnemonic === this.mnemonic) {
        this.createAccount()
      } else {
        alert("mnemonic doesn't match")
      }
    },

    verify_privkey: async function () {
      if (this.input_privkey === this.privateKey) {
        this.createAccount()
      } else {
        alert("private key doesn't match")
      }
    },
    createAccount: async function () {
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
  nav > div:first-child {
    padding-left: 0 !important;
  }
  nav > div + div {
    border-left: 1px solid #aaa;
  }
</style>
