<template>
  <modal>
    <h4 slot="header">Warning</h4>
    <div slot="body">
      <p class="helper py-2">
        Transfer to <span class="pink">{{ to }}</span> with <span class="pink">{{ amount }} COS</span>
      </p>
    </div>
    <div slot="footer" class="width100">
      <button class="btn btn-modal" @click="$emit('confirm')">
        <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="working"></vue-loading>
        <span v-if="!working">Confirm</span>
      </button>
      <button class="btn btn-modal" @click="$emit('close')">Close</button>
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
  .pink {
    color: #e83e8c;
  }
</style>
