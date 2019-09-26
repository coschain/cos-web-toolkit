<template>
  <modal>
    <div slot="header">
      <img class="close-button" src="../assets/close.png" alt="X" v-on:click="$emit('close-modal')"/>
      <h4>Warning</h4>
    </div>
    <div slot="body">
      <p class="helper">
        It will replace your private key and public key by a new one, confirm you have saved and kept new private key safe <br/>
        Otherwise your account would lose.
      </p>
    </div>
    <div slot="footer" class="width100">
      <button class="btn btn-modal-large" @click="$emit('confirm')">
        <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
        <span v-if="!processing">Confirm</span>
      </button>
    </div>
  </modal>
</template>

<script>
import modal from './Modal'
import { VueLoading } from 'vue-loading-template'
export default {
  props: ['processing'],
  name: 'UpdateConfirm',
  components: {
    modal,
    VueLoading
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .width100 {
    width: 100%;
  }
  .helper {
    padding: 0;
    margin: 0;
  }
</style>
