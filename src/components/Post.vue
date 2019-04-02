<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
    <div class="container post py-2">
      <div class="post-body">
        <div class="py-2">
          <label for="title" v-bind:class="{active: title_focus || title.length > 0}">Title</label>
          <input type="text" class="form-item" id="title" v-model="title" @focus="title_focus=true" @blur="title_focus=false" required>
        </div>
        <div class="py-2">
          <label for="content" v-bind:class="{active: content_focus || content.length > 0}">Content</label>
          <textarea id="content" class="textarea form-item" rows="5" v-model="content" @focus="content_focus=true" @blur="content_focus=false" required></textarea>
        </div>
        <div class="py-2">
          <label for="tags" v-bind:class="{active: tag_focus || tags.length > 0 }">Tags</label>
          <input type="text" class="form-item" id="tags" v-model="tags" @focus="tag_focus=true" @blur="tag_focus=false">
        </div>
      </div>
      <button class="btn btn-block" v-on:click="generatePostTx" :disabled="checkWorking" >
        <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="working"></vue-loading>
        <span v-if="!working">Generate Post Transaction</span>
      </button>
    </div>
    </template>
  </div>
</template>

<script>
import unlock from './Unlock.vue'
import {post} from '../encrypt/clientsign'
import { VueLoading } from 'vue-loading-template'

export default {
  name: 'Post',
  data () {
    return {
      content_focus: false,
      title_focus: false,
      tag_focus: false,
      working: false,
      tags: '',
      title: '',
      content: ''
    }
  },
  components: {
    unlock,
    VueLoading
  },
  methods: {
    async generatePostTx () {
      this.working = true
      let r = await post(this.$store.state.username, this.title, this.content, this.tags, this.$store.state.privkey)
      if (r.invoice.status === 200) {
        // this.$router.push('http://explorer.contentos.io/#/user-article/' + this.$store.state.username)
        // window.location.href = 'http://explorer.contentos.io/#/user-article/' + this.$store.state.username
        alert('Post Success')
        window.open('http://explorer.contentos.io/#/user-article/' + this.$store.state.username)
      } else {
        alert('generate post tx failed')
      }
      this.working = false
    }
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    },
    checkWorking () {
      return this.working
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../static/scss/common";
  label {
    position: absolute;
    top: .65rem;
    left: 0;
    -webkit-transition: .2s ease-out;
    -o-transition: .2s ease-out;
    transition: .2s ease-out;
    cursor: text;
    color: #757575;
  }
  .active {
    transform: translateY(-120%);
    color: #333;
  }
  .form-item {
    width: 100%;
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #ced4da;
    background-color: transparent;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    outline: 0;
    display: block;
    font-size: 1rem;
    font-weight: 400;
    line-height: 2rem;
  }
  .post-body > div {
    position: relative;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>
