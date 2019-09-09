<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
      <div class="container py-2">
        <div class="row">
          <div class="col-md-12">
            <p v-show="voted_bp.length > 0">You have voted to block producer:<span class="pink">{{ voted_bp }}</span></p>
            <p v-show="voted_bp.length === 0">You haven't voted to anyone.</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table">
              <thead>
              <th>Name</th>
              <th>Website</th>
              <th>Votes</th>
              <th>Produced Blocks</th>
              <th></th>
              </thead>
              <tbody>
              <template v-if="hasVoted">
                <td>{{ voted_record.bp }}</td>
                <td>{{ voted_record.url }}</td>
                <td>{{ voted_record.voterCount }}</td>
                <td>{{ voted_record.generated_block }}</td>
                <td>
                  <button v-on:click="unvote(voted_record.bp)" class="btn vote-btn">
                    <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="voting"></vue-loading>
                    <span v-if="!voting">unvote</span>
                  </button>
                </td>
              </template>
              <tr v-for="(row, i) in rows" v-if="row.owner.value !== voted_bp" :key="i">
                <td>{{ row.owner.value }}</td>
                <td>{{ row.url }}</td>
                <td>{{ row.voterCount }}</td>
                <td>{{ row.genBlockCount }}</td>
                <td>
                    <button v-on:click="vote(row.owner.value)" class="btn vote-btn">
                      <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="voting"></vue-loading>
                      <span v-if="!voting">vote</span>
                    </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <button v-show="!no_more" v-on:click="loadMore" class="btn load-btn">
            <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="loading"></vue-loading>
            <span v-if="!loading">load more</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import unlock from './Unlock.vue'
import { VueLoading } from 'vue-loading-template'
import { getBlockProducerList, voteToBlockProducer, accountInfo, bpInfo } from '../encrypt/clientsign'

export default {
  name: 'BpVote',
  data () {
    return {
      rows: [],
      voted_bp: '',
      voted_record: {
        bp: '',
        url: '',
        voterCount: 0,
        generated_block: 0
      },
      start: null,
      lastBlockProducer: null,
      no_more: false,
      per_page: 30,
      voting: false,
      loading: false
    }
  },
  async mounted () {
    await this.loadData()
  },
  components: {
    unlock,
    VueLoading
  },
  methods: {
    async loadData () {
      if (!this.ok) return
      await this.loadBPList()
      await this.loadVoteData()
    },
    async loadBPList () {
      let data = await getBlockProducerList(this.start, this.per_page, this.lastBlockProducer)
      if (data && data.getBlockProducerListList()) {
        for (let row of data.getBlockProducerListList()) {
          let object = row.toObject()
          this.rows.push(object)
          this.lastBlockProducer = row
          this.start = row.getBpVest().getVoteVest()
        }
        // console.log(data.getBlockProducerListList().length)
        if (data.getBlockProducerListList().length < this.per_page) {
          this.no_more = true
        }
      } else {
        this.no_more = true
      }
    },
    async loadBpInfo (bp) {
      let bpinfo = await bpInfo(bp)
      if (bpinfo && bpinfo.owner) {
        this.voted_record.bp = bpinfo.owner.value
        this.voted_record.url = bpinfo.url
        this.voted_record.voterCount = bpinfo.voterCount
        this.voted_record.generated_block = bpinfo.genBlockCount
      } else {
        this.voted_record.bp = this.voted_bp
        this.voted_record.voterCount = 1
      }
    },
    async loadVoteData () {
      let account = await accountInfo(this.$store.state.username)
      if (account && account.info) {
        this.voted_bp = account.info.votedBlockProducer.value
        await this.loadBpInfo(this.voted_bp)
      }
    },
    async vote (bp) {
      this.voting = true
      let voter = this.$store.state.username
      let privkey = this.$store.state.privkey
      if (this.voted_bp.length > 0) {
        let text = 'You have voted to ' + this.voted_bp + ' unvote it before you vote to others'
        alert(text)
      } else {
        let result = await voteToBlockProducer(voter, bp, false, privkey)
        if (result && result.invoice && result.invoice.status === 200) {
          await this.loadVoteData()
        }
        alert('vote success!')
      }
      this.voting = false
    },
    async unvote (bp) {
      this.voting = true
      let voter = this.$store.state.username
      let privkey = this.$store.state.privkey
      if (this.voted_bp.length > 0) {
        let result = await voteToBlockProducer(voter, bp, true, privkey)
        if (result && result.invoice && result.invoice.status === 200) {
          await this.loadVoteData()
        }
        alert('unvote success!')
      } else {
        alert("You haven't voted to anyone")
      }
      this.voting = false
    },
    async loadMore () {
      await this.loadBPList()
    }
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    },
    hasVoted () {
      return this.voted_bp.length > 0
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
  p {
    font-size: 1.2rem;
  }
  span {
    margin-left: 0.5rem;
  }
  .pink {
    color: #e83e8c;
  }
  .vote-btn {
    text-align: center;
    padding: 10px 8px;
    width: 100px;
    &:hover {
      opacity: 0.65;
      color: #fff;
      outline: none;
    }
  }
  .load-btn {
    margin: auto;
    border: 1px solid rgba(0,0,0,.2);
    color: grey;
    background-color: #fff;
    &:hover {
      outline: none;
      opacity: .6;
    }
  }
  td {
    vertical-align: middle;
  }
</style>
