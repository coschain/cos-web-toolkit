<template>
  <div class="container py-2">
    <div class="update-input">
      <label for="u-input" class="py-2">AccountName</label>
      <input type="text" class="form-control py-3 disabled" id="u-input" placeholder="username in coschain" :value="username" disabled>
      <label for="p-input" class="py-2">Enter your new private key:</label>
      <input type="text" class="form-control py-3" id="p-input" placeholder="Do NOT input in public" v-model="newPrivateKey" required>
    </div>
    <button class="btn btn-block" v-on:click="update" :disabled="!check">
      <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
      <span v-if="!processing">Update</span>
    </button>
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'
import {accountupdate} from '../encrypt/clientsign'
export default {
  name: 'AccountUpdate',
  data () {
    return {
      username: this.$store.state.username,
      privateKey: this.$store.state.privkey,
      newPrivateKey: '',
      processing: false
    }
  },
  methods: {
    check: function () {
      return this.privateKey.length >= 30 && this.privateKey.match(/^[0-9a-zA-Z]+$/)
    },
    update: async function () {
      this.processing = true
      let r = await accountupdate(this.username, this.converting, this.privkey, this.toaccount)
      if (r && r.invoice && r.invoice.status === 200) {
        this.$store.commit('setPrivkey', this.newPrivateKey)
        this.$router.push({name: 'UpdateSuccess', params: { username: this.username }})
      } else {
        alert('update account failed')
      }
      this.processing = false
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
