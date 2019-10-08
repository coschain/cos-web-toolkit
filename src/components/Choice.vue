<template>
  <div class="container transparent">
    <div class="row">
      <div class="col-md-6">
        <div class="vertical-container">
          <div class="header">
            <p>I don't have a Contentos account</p>
          </div>
          <div class="body">
            <router-link class="btn btn-block" to="accountname" tag="button" disabled>Create a new account</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="vertical-container">
          <div class="header">
            <p>I have a Contentos account</p>
          </div>
          <div class="body">
            <router-link class="btn btn-block" to="import" tag="button">Import an account</router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Choice'
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .vertical-container {
    width: 580px;
    height: 280px;
    background-color: #ffffff;
    text-align: center;
    box-shadow: 2px 4px 30px 0 rgba(0,39,170,0.16);
    border-radius: 8px;
    p {
      font-size: 24px;
      color: #000000;
      letter-spacing: 0;
    }
    .header {
      padding-top: 80px;
    }
    .body {
      padding-top: 59px;
    }
    .btn-block {
      width: 390px;
      height: 52px;
      margin: auto;
    }
  }
</style>
