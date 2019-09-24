<template>
  <div class="container">
    <div class="box">
      <p class="success">Public Key Update Success !</p>
      <p>You will be logged out from wallet, using new private key to unlock</p>
      <router-link class="btn btn-primary" tag="button" to="import">Goto Import</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateSuccess',
  props: ['username']
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .box {
    text-align: center;
    height: 273px;
  }
  p {
    font-size: 18px;
    span {
      color: #e83e8c;
    }
    margin-bottom: 40px;
  }
  .success {
    font-size: 24px;
    color: #333333;
    padding-top: 30px;
    margin-bottom: 30px;
  }
  .btn {
    margin: auto;
  }

</style>
