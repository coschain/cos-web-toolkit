'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER: '"http://localhost:3000"',
  VUE_APP_FAUCET: true,
  VUE_APP_CHAIN: '"https://testnode.contentos.io"'
})
