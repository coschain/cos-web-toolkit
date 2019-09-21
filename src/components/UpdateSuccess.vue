<template>
  <div class="parent">
    <div class="child">
      <p class="success">Private Key Update Success !</p>
      <p>Your Account Name is: <span>{{ username }}</span></p>
      <router-link class="btn" to="account">Goto Account</router-link>
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
  .parent {
    position: relative;
    height: 400px;
  }
  .child {
    font-size: 20px;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
  }
  span {
    color: #e83e8c;
    font-size: 24px;
  }
  .success {
    font-size: 28px;
  }

</style>
