<template>
<div>
  <div class="container">
    <header class="py-3 header">
      <div class="row flex-nowrap justify-content-between align-items-center">
        <div class="col-4 pt-1">
          <a class="logo-text" href="#">Contentos</a>
        </div>
      </div>
    </header>
    <div class="row">
      <div class="logo"></div>
    </div>
  </div>
  <div class="container">
    <div class="nav-scroller py-1 mb-2">
    <nav class="nav d-flex justify-content-between">
      <router-link class="p-2 nav-item-text" to="/">Create New Account</router-link>
      <router-link class="p-2 nav-item-text" to="import">Import Existed Account</router-link>
      <a class="p-2 nav-item-text" href="#">Broadcast Transaction</a>
      <router-link class="p-2 nav-item-text" to="info">View Account</router-link>
    </nav>
  </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="scss" scoped>
  .header {
    line-height: 1;
    border-bottom: 1px solid #e5e5e5;
  }
.logo-text {
  color: #333;
  font-size: 3.6rem;
}
  .nav-item-text {
    font-size: 1.2rem;
    color: #333;
  }
</style>
