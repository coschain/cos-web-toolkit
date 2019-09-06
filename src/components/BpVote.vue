<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
      <div class="container send py-2">
        <div class="row">
          <div class="col-md-8">
            <p>You Voted Block Producer:</p>
            <span>initminer</span>
          </div>
          <div class="col-md-2">
           <button id="reset" class="btn btn-danger">
             <span>Reset</span>
           </button>
          </div>
          <div class="col-md-2">
            <button id="vote" v-on:click="vote" class="btn btn-primary">
              <span>Vote</span>
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table">
              <thead>
              <th>Name</th>
              <th>Website</th>
              <th>Votes</th>
              <th></th>
              </thead>
              <tbody>
              <tr v-for="(row, i) in rows" :key="i">
                <td>{{ row.owner.value }}</td>
                <td>{{ row.url }}</td>
                <td>{{ row.voterCount }}</td>
                <td>
                  <input type="radio" :value="row.owner.value" v-model="voted_bp" >
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import unlock from './Unlock.vue'
import { getBlockProducerList, voteToBlockProducer } from '../encrypt/clientsign'

export default {
  name: 'BpVote',
  data () {
    return {
      rows: [],
      voted_bp: ''
    }
  },
  components: {
    unlock
  },
  methods: {
    async loadData () {
      if (!this.ok) return
      let data = await getBlockProducerList()
      this.rows = data.blockProducerListList
      console.log(this.rows)
    },
    async vote () {
      let voter = this.$store.state.username
      let privkey = this.$store.state.privkey
      let result = await voteToBlockProducer(voter, this.voted_bp, privkey)
      console.log(result)
    }
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    }
  },
  watch: {
    ok: function () {
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
</style>
