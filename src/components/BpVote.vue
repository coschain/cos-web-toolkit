<template>
  <div>
    <Header></Header>
  <div class="container">
    <div class="box">
    <div class="row">
      <div class="col-md-12">
        <p v-show="voted_bp.length > 0">You have voted to block producer: <span class="blue">{{ voted_bp }}</span></p>
        <p v-show="voted_bp.length === 0">You haven't voted to anyone.</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table">
          <thead>
          <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Website</th>
          <th>Voters</th>
          <th>VEST Votes</th>
          <th>Produced Blocks</th>
          <th></th>
          </tr>
          </thead>
          <tbody>
          <template v-if="hasVoted">
            <tr>
            <td>{{ my_bp_rank }}</td>
            <td>{{ voted_record_bp }}</td>
            <td>{{ voted_record_url }}</td>
            <td>{{ voted_record_voteCount }}</td>
            <td>{{ voted_record_vest }}</td>
            <td>{{ voted_record_blocks }}</td>
            <td>
              <button v-on:click="unvote(voted_record_bp)" class="btn btn-primary">
                <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="unvoting"></vue-loading>
                <span v-if="!unvoting">unvote</span>
              </button>
            </td>
            </tr>
          </template>
          <tr v-for="(row, i) in rows" v-if="row.getOwner().getValue() !== voted_bp" :key="i">
            <td>{{ getRank(row.getOwner().getValue()) }}</td>
            <td>{{ row.getOwner().getValue() }}</td>
            <td>{{ row.getUrl() }}</td>
            <td>{{ row.getVoterCount() }}</td>
            <td>{{ row.getBpVest().getVoteVest().toString() }}</td>
            <td>{{ row.getGenBlockCount()}}</td>
            <td>
                <button v-on:click="vote(row.getOwner().getValue())" class="btn btn-primary" :disabled="hasVoted">
                  <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="voting[row.getOwner().getValue()]"></vue-loading>
                  <span v-if="!voting[row.getOwner().getValue()]">vote</span>
                </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>

<script>

import Header from './Header'
import { VueLoading } from 'vue-loading-template'
import { getBlockProducerList, voteToBlockProducer, accountInfo, bpInfo } from '../encrypt/clientsign'

export default {
  name: 'BpVote',
  data () {
    return {
      rows: [],
      voted_bp: '',
      voted_record_bp: '',
      voted_record_url: '',
      voted_record_voteCount: 0,
      voted_record_blocks: 0,
      voted_record_vest: '0 vest',
      start: null,
      lastBlockProducer: null,
      no_more: false,
      per_page: 30,
      loading: false,
      unvoting: false,
      my_bp_rank: '-',
      ranks: {},
      voting: {}
    }
  },
  async mounted () {
    await this.loadData()
  },
  components: {
    VueLoading,
    Header
  },
  methods: {
    loadData () {
      Promise.all([this.loadBPList(), this.loadVoteData()]).then((values) => {
        this.my_bp_rank = this.getRank(this.voted_record_bp)
      })
    },
    async forceLoadData () {
      this.no_more = false
      this.rows = []
      this.ranks = {}
      this.start = null
      this.lastBlockProducer = null
      await this.loadData()
    },
    async loadBPList () {
      let data = await getBlockProducerList(this.start, this.per_page, this.lastBlockProducer)
      if (data && data.getBlockProducerListList()) {
        for (let row of data.getBlockProducerListList()) {
          // let object = row.toObject()
          this.rows.push(row)
          this.lastBlockProducer = row
          this.start = row.getBpVest().getVoteVest()
          this.voting[row.getOwner().getValue()] = false
        }
        if (data.getBlockProducerListList().length < this.per_page) {
          this.no_more = true
        }
      } else {
        this.no_more = true
      }
      if (!this.no_more) {
        await this.loadBPList()
      }
      if (this.no_more) {
        await this.loadRank()
      }
    },
    async loadBpInfo (bp) {
      if (bp.length > 0) {
        let bpinfo = await bpInfo(bp)
        if (bpinfo && bpinfo.getOwner().getValue()) {
          this.voted_record_bp = bpinfo.getOwner().getValue()
          this.voted_record_url = bpinfo.getUrl()
          this.voted_record_voteCount = bpinfo.getVoterCount()
          this.voted_record_blocks = bpinfo.getGenBlockCount()
          this.voted_record_vest = bpinfo.getBpVest().getVoteVest().toString()
          this.voting[bpinfo.getOwner().getValue()] = false
        } else {
          this.voted_record_bp = this.voted_bp
          this.voted_record_vest = '0 vest'
          this.voted_record_voteCount = 1
          this.voting[this.voted_bp] = false
        }
      }
    },
    getRank (bp) {
      const rank = this.ranks[bp]
      if (rank === undefined) {
        return '-'
      } else {
        return rank
      }
    },
    async loadVoteData () {
      let account = await accountInfo(this.$store.state.username)
      if (account && account.info) {
        this.voted_bp = account.info.votedBlockProducer.value
        await this.loadBpInfo(this.voted_bp)
      }
    },
    async loadRank () {
      for (let [index, row] of this.rows.entries()) {
        const bp = row.getOwner().getValue()
        this.ranks[bp] = index + 1
      }
    },
    async vote (bp) {
      let voter = this.$store.state.username
      let privkey = this.$store.state.privkey
      this.voting = {
        ...this.voting,
        [bp]: true
      }
      if (this.voted_bp.length > 0) {
        let text = 'You have voted to ' + this.voted_bp + ' unvote it before you vote to others'
        alert(text)
      } else {
        let result = await voteToBlockProducer(voter, bp, false, privkey)
        if (result && result.invoice && result.invoice.status === 200) {
          await this.forceLoadData()
        }
        this.$nextTick(() => {
          alert('vote success!')
        })
      }
      this.voting = {
        ...this.voting,
        [bp]: false
      }
    },
    async unvote (bp) {
      this.unvoting = true
      let voter = this.$store.state.username
      let privkey = this.$store.state.privkey
      if (this.voted_bp.length > 0) {
        let result = await voteToBlockProducer(voter, bp, true, privkey)
        if (result && result.invoice && result.invoice.status === 200) {
          this.rows = []
          await this.forceLoadData()
        }
        this.$nextTick(() => {
          alert('unvote success!')
        })
      } else {
        alert("You haven't voted to anyone")
      }
      this.unvoting = false
    },
    async loadMore () {
      await this.loadBPList()
    }
  },
  computed: {
    hasVoted () {
      return this.voted_bp.length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";
  p {
    font-size: 18px;
  }
  span {
    font-size: 18px;
    color: #180000;
    letter-spacing: 0;
    line-height: 22px;
  }
  .blue {
    color: #3674FF;
    font-weight: 500;
  }
  .table th {
    font-size: 16px;
    font-weight: 500;
    border: none;
    border-bottom: 1px solid #EBEBEB;
  }
  td {
    vertical-align: middle;
    font-size: 14px;
    padding-top: 36px;
    padding-bottom: 17px;
    border-top: none;
  }
  .btn {
    width: 120px;
    height: 40px;
    border-radius: 26px;
    span {
      font-size: 18px;
      color: #ffffff;
    }
  }
</style>
