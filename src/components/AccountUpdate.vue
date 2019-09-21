<template>
  <div class="container py-2">
    <div class="update-input">
      <label for="u-input" class="py-2">AccountName</label>
      <input type="text" class="form-control py-3 disabled" id="u-input" placeholder="username in coschain" :value="username" disabled>
      <label for="p-input" class="py-2">Enter your new private key:</label>
      <input type="text" class="form-control py-3" id="p-input" placeholder="Do NOT input in public" v-model="privateKey" required>
    </div>
    <button class="btn btn-block" v-on:click="update" :disabled="!check">
      <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="checking"></vue-loading>
      <span v-if="!checking">Update</span>
    </button>
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'
export default {
  name: 'AccountUpdate',
  data () {
    return {
      current: 'mnemonic'
    }
  },
  methods: {
    update: function () {
    }
  },
  components: {
    VueLoading
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
