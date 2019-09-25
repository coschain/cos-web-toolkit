<template>
  <div>
  <Header></Header>
  <div class="container">
    <div class="box">
    <div class="update-input">
      <div class="row">
      <label for="u-input">Account</label>
      <input type="text" class="form-control" id="u-input" placeholder="username in coschain" :value="username" disabled>
      </div>
      <div class="row">
      <label for="p-input">Enter your new <span>public key</span>:</label>
      <input type="text" class="form-control" id="p-input" placeholder="Input your new public key" v-model="newPubKey" required>
      </div>
    </div>
    <update-confirm v-if="show" @close="closeModal" @confirm="confirm" v-bind:processing="processing"></update-confirm>
    <button class="btn btn-primary" v-on:click="show = true" :disabled="!check">Update</button>
  </div>
  </div>
  </div>
</template>

<script>
import UpdateConfirm from './UpdateConfirm'
import Header from './Header'
import {accountupdate} from '../encrypt/clientsign'
export default {
  name: 'AccountUpdate',
  data () {
    return {
      username: this.$store.state.username,
      privateKey: this.$store.state.privkey,
      newPubKey: '',
      processing: false,
      show: false
    }
  },
  methods: {
    closeModal: function () {
      this.show = false
    },
    confirm: async function () {
      this.processing = true
      let r = await accountupdate(this.username, this.newPubKey, this.privateKey)
      if (r && r.invoice && r.invoice.status === 200) {
        this.$store.commit('setPrivkey', '')
        this.$router.push({name: 'UpdateSuccess', params: { username: this.username }})
      } else {
        alert('update account failed')
      }
      this.processing = false
    }
  },
  computed: {
    check: function () {
      return this.newPubKey.length >= 30 && this.newPubKey.match(/^[0-9a-zA-Z]+$/)
    }
  },
  components: {
    UpdateConfirm,
    Header
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .box {
    .update-input {
      .row {
        margin-left: 0;
        margin-right: 0;
      }
      & > .row + .row {
        margin-top: 26px;
      }
    }
  }
  label {
    font-size: 16px;
  }
  span {
    font-weight: 500;
  }
  .btn {
    margin-top: 50px;
  }
</style>
