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
      <button class="btn btn-block" @click="$emit('confirm')">Confirm</button>
      <button class="btn btn-block" @click="$emit('close')">Close</button>
    </div>
  </modal>
</template>

<script>
import modal from './Modal'
export default {
  name: 'UpdateConfirm',
  components: {
    modal
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .width100 {
    width: 100%;
  }
</style>
