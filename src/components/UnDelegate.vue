<template>
  <div class="container">
    <div class="box">
    <div class="row">
      <div class="col-md-12">
        <table class="table">
          <thead>
          <tr>
          <th>Order-ID</th>
          <th>To</th>
          <th>Vests</th>
          <th>Created Block</th>
          <th>Maturity Block</th>
          <th>Matured</th>
          <th>Delivery</th>
          <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td>{{ row.getId() }}</td>
            <td>{{ row.getToAccount().getValue() }}</td>
            <td>{{ row.getAmount().getValue() / 1e6 }}</td>
            <td>{{ row.getCreatedBlock() }}</td>
            <td>{{ row.getMaturityBlock() }}</td>
            <td>{{ headBlockNumber > row.getMaturityBlock() ? 'yes' : 'no' }}</td>
            <td>{{ row.getDelivering() }}</td>
            <td>
                <button v-on:click="unDelegate(row.getId())" class="btn btn-primary" :disabled="!display[row.getId()]">
                  <vue-loading type="spin" color="rgba(255,255,255,0.7)" :size="{ width: '30px', height: '30px' }"
                  v-if="!(headBlockNumber > row.getMaturityBlock())"></vue-loading>
                  <span v-if="(headBlockNumber > row.getMaturityBlock())">undelegate</span>
                </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
    </div>
</template>

<script>

import Header from './Header'
import { VueLoading } from 'vue-loading-template'
import { delegateInfo, undelegate } from '../encrypt/clientsign'
const axios = require('axios')

export default {
  name: 'un_delegate',
  data () {
    return {
      rows: [],
      username: this.$store.state.username,
      delegate_order_id: 0,
      delegate_from: '',
      delegate_to: '',
      delegate_vest: 0,
      delegate_created: '',
      delegate_maturity: '',
      delegate_matured: '',
      delegate_delivery: '',
      headBlockNumber: 0,
      display: {},
      start: 0,
      per_page: 30,
      no_more: false
    }
  },
  async mounted () {
    await this.loadDelegateList()
  },
  components: {
    VueLoading,
    Header
  },
  methods: {
    async loadData () {
      this.username = this.$store.state.username
      let r = await axios({
        method: 'post',
        url: process.env.SERVER ? process.env.SERVER + '/v1/account' : '/v1/account',
        data: {
          name: this.username
        }
      })
      console.log(r)
      if (r.data.state && r.data.state.dgpo) {
        this.headBlockNumber = r.data.state.dgpo.headBlockNumber
      }
    },
    async forceLoadData () {
      this.rows = []
      this.no_more = false
      this.start = 0
      await this.loadDelegateList()
    },
    async loadDelegateList () {
      await this.loadData()
      await this.loadDelegateListInner()
    },
    async loadDelegateListInner () {
      let data = await delegateInfo(this.$store.state.username, this.start, this.per_page)
      if (data && data.getOrdersList()) {
        for (let row of data.getOrdersList()) {
          this.rows.push(row)
          this.display[row.getId()] = ((this.headBlockNumber > row.getMaturityBlock()) && !row.getDelivering())
          this.start = row.getId()
        }
        if (data.getOrdersList().length < this.per_page) {
          this.no_more = true
        }
      } else {
        this.no_more = true
      }
      if (!this.no_more) {
        await this.loadDelegateListInner()
      }
    },
    async unDelegate (id) {
      let username = this.$store.state.username
      let privkey = this.$store.state.privkey
      let result = await undelegate(username, id, privkey)
      if (result && result.invoice && result.invoice.status === 200) {
        alert('undelegate success!')
        await this.forceLoadData()
      }
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
