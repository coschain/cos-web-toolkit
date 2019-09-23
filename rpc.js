const Cos = require("@coschain/cosjs");

function getChainId () {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'main'
    case 'testing':
      return 'test'
    case 'production':
      return 'main'
    default:
      return 'main'
  }
}

const HOST = process.env.CHAIN;

const CREATOR = "accountcreator";
const CREATORKEY = process.env.CREATOR;

const cos = new Cos(getChainId(), HOST);

cos.wallet.addAccount(CREATOR, CREATORKEY);

exports.getAccountByName = async function(name) {
  return cos.wallet.accountInfo(name)
};

exports.chainInfo = async function() {
  return cos.wallet.chainInfo()
};

// the user accountcreator is the root creator.
exports.createAccount = async function(name, pubkey) {
  return cos.wallet.createAccount(CREATOR, name, pubkey)
};

exports.dripOneCOS = async function (name) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  return cos.wallet.transfer(CREATOR, name, "1.000000", "")
};
