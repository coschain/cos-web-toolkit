<template>
  <modal>
    <h4 slot="header">Warning</h4>
    <div slot="body">
      <p class="helper py-2">
        It will replace your private key and public key by a new one, confirm you have saved and kept new private key safe <br/>
        Otherwise your account would lose.
      </p>
    </div>
    <div slot="footer" class="width100">
      <button class="btn btn-primary" @click="$emit('confirm')">
        <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
        <span v-if="!processing">Confirm</span>
      </button>
      <button class="btn btn-primary" @click="$emit('close')">Close</button>
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
</style>
