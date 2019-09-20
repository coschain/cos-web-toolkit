<template>
  <div class="container body py-2">
    <label for="u-input" class="py-2">Enter a username:（Between 6 and 16 characters）</label>
    <input type="text" class="form-control py-3" id="u-input" placeholder="username in coschain" v-model="username" required>
    <button class="btn btn-block" v-on:click="gotoGenerate">Next</button>
  </div>
</template>

<script>
export default {
  name: 'AccountName',
  data () {
    return {
      username: ''
    }
  },
  methods: {
    gotoGenerate: function () {
      this.$router.push({name: 'Generate', params: {username: this.username}})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
</style>
