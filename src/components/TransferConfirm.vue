<template>
  <modal>
    <div slot="header">
      <img class="close-button" src="../assets/close.png" alt="X" v-on:click="$emit('close-modal')"/>
      <h4>Warning</h4>
    </div>
    <div slot="body">
      <p class="helper">
        Transfer to <span class="pink">{{ to }}</span> with <span class="pink">{{ amount }} COS</span>
      </p>
    </div>
    <div slot="footer" class="width100">
      <button class="btn width100" @click="$emit('confirm')">
        <vue-loading type="spin" color="rgba(255, 255, 255, 0.7)" :size="{ width: '30px', height: '30px' }" v-if="working"></vue-loading>
        <span v-if="!working">Confirm</span>
      </button>
    </div>
  </modal>
</template>

<script>
import modal from './Modal'
import { VueLoading } from 'vue-loading-template'
export default {
  props: ['to', 'amount', 'working'],
  name: 'TransferConfirm',
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
  .btn {
    height: 52px;
  }
</style>
