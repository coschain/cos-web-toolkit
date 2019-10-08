<template>
  <modal>
    <div slot="header">
      <img class="close-button" src="../assets/close.png" alt="X" v-on:click="$emit('close-modal')"/>
      <h4>Warning</h4>
    </div>
    <div slot="body">
      <p class="helper">
        Account does not match with the {{ text }}. Or
        perhaps you already binded this Account to  <a href="https://cos.tv">cos.tv</a>?
        You can unbind the Account to access the wallet again.
        Don't worry, your fund is SAFE.
      </p>
    </div>
    <div slot="footer" class="width100">
      <button class="btn btn-modal-large" @click="goto">I have bound costv, go to unbind</button>
      <button class="btn btn-modal-large" @click="$emit('close-modal')">No, try again</button>
    </div>
  </modal>
</template>

<script>
import modal from './Modal'
export default {
  name: 'PrivOrMnemonicFailed',
  props: ['text'],
  components: {
    modal
  },
  methods: {
    goto: function () {
      window.open('https://cos.tv')
      this.$emit('close-modal')
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
