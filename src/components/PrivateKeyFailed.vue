<template>
  <modal>
    <h4 slot="header">Warning</h4>
    <div slot="body">
      <p class="helper">
        Account does not match with the private key OR
        Perhaps you already binded this Account to <a href="https://cos.tv">cos.tv</a>?
        You can unbind the Account to access the wallet again.
        Don’t worry, your fund is SAFE.
      </p>
    </div>
    <div slot="footer" class="width100">
      <button class="btn btn-modal" @click="goto">I have binded costv, Go unbind</button>
      <button class="btn btn-modal" @click="$emit('close')">NO, Try Again</button>
    </div>
  </modal>
</template>

<script>
import modal from './Modal'
export default {
  name: 'PrivateKeyFailed',
  components: {
    modal
  },
  methods: {
    goto: function () {
      window.open('https://cos.tv')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .width100 {
    width: 100%;
  }
</style>
