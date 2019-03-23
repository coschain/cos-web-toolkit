'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  VUE_APP_CHAIN: '"https://testnode.contentos.io"',
  VUE_APP_FAUCET: true
})
