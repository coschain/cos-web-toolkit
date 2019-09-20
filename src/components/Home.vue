<template>
  <div class="container py-2">
    <div class="row vertical-divider">
      <div class="col-md-6">
        <div class="vertical-container">
          <div class="header">
            <h3>I don't have a Contentos account</h3>
          </div>
          <div class="body">
            <router-link class="btn btn-block" to="accountname">Create a new account</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="vertical-container">
          <div class="header">
            <h3>I have a Contentos account</h3>
          </div>
          <div class="body">
            <router-link class="btn btn-block" to="import">Import an account</router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  .row.vertical-divider {
    overflow: hidden;
  }
  .row.vertical-divider > div[class^="col-"] {
    text-align: center;
    padding-bottom: 100px;
    margin-bottom: -100px;
    border-right: 1px solid #e5e5e5;
  }
  .row.vertical-divider div[class^="col-"]:first-child {
    border-left: none;
  }
  .row.vertical-divider div[class^="col-"]:last-child {
    border-right: none;
  }
  .vertical-container {
    text-align: center;
    h3 {
      font-weight: 500;
      line-height: 1.2;
      text-align: center;
    }
    .header {
      padding-top: 3rem;
    }
    .body {
      padding-top: 3rem;
    }
  }
</style>
