<template>
  <div>
    <unlock v-if="!ok"></unlock>
    <template v-if="ok">
      <div class="container send py-2">
        <div class="row">
          <div class="col-md-6">
            <label for="caller">Caller</label>
            <input type="text" class="form-item disabled" id="caller" :value="username" disabled>
          </div>
          <div class="col-md-6">
            <label for="stamina">Stamina</label>
            <input type="text" class="form-item disabled" id="stamina" :value="stamina" disabled>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <label for="contract">Contract</label>
            <input type="text" class="form-item" id="contract" v-model="contract">
          </div>
          <div class="col-md-4">
            <label for="owner">Contract Owner</label>
            <input type="text" class="form-item" id="owner" v-model="owner">
          </div>
          <div class="col-md-4">
            <label for="method">Method</label>
            <input type="text" class="form-item" id="method" v-model="method">
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <label for="args">Arguments</label>
            <input type="text" class="form-item" id="args" v-model="args">
          </div>
        </div>
        <button class="btn btn-block" v-on:click="generateContractCallTx" :disabled="!checkParams" >
          <vue-loading type="spin" color="#d9544e" :size="{ width: '30px', height: '30px' }" v-if="processing"></vue-loading>
          <span v-if="!processing">Generate Transaction</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import unlock from './Unlock.vue'
import { VueLoading } from 'vue-loading-template'
import { mapState } from 'vuex'
import {contractcall} from '../encrypt/clientsign'

export default {
  name: 'Contract',
  data () {
    return {
      // username: this.$store.state.username,
      // privkey: this.$store.state.privkey,
      processing: false,
      contract: '',
      owner: '',
      method: '',
      args: ''
    }
  },
  components: {
    unlock,
    VueLoading
  },
  methods: {
    async generateContractCallTx () {
      this.processing = true
      let privkey = this.$store.state.privkey
      let r = await contractcall(this.username, this.owner, this.contract, this.method, this.args, privkey)
      console.log(r)
      if (r && r.invoice && r.invoice.status === 200) {
        alert('call method success')
      } else {
        alert('generate transfer tx failed')
      }
      this.processing = false
    }
  },
  computed: {
    ok () {
      return this.$store.getters.ok
    },
    checkParams () {
      return this.owner.length > 0 && this.contract.length > 0 && this.method.length > 0 && this.args.length > 0
    },
    ...mapState({
      stamina: state => state.stamina,
      username: state => state.username
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "../../static/scss/common";

  .row {
    margin-bottom: 0.8rem;
  }

  .disabled {
    background-color: #e9ecef;
  }

  label {
    font-size: 1.2rem;
  }

  input {
    background-color: #f5f5f5;
    border-radius: 3px;
    box-shadow: none;
    width: 100%;
    color: #565656;
    font-size: 0.875rem;
    line-height: 1.43;
    min-height: 3em;
    padding: 0.2em 1.07em 0.2em;
    border: 1px solid #e8e8e8;

  &:focus {
     outline: none;
   }
  }

  div.amount {
    position: relative;
  .symbol {
    font-size: 0.875rem;
    line-height: 3em;
    pointer-events: none;
    position: absolute;
    right: 3px;
    top: 0;
  }
  }
</style>
