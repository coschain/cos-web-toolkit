<template>
  <div class="container">
    <div class="box">
      <p class="success">Import Success !</p>
      <p>Your Account Name is: <span>{{ username }}</span></p>
      <router-link class="btn btn-primary" tag="button" to="account">Goto Account</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImportSuccess',
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
