'use strict';
// libraries
const pawjs = require('@paw-digital/pawjs');
const chai = require('chai');

// modules
const accountUtil = require('../scripts/util/account-util.js');
const assert = chai.assert;
const expect = chai.expect;

// constants

// variables

// functions

// tests

const Conf = require('conf');

const conf = new Conf({
  projectName: 'camo-paw-light-wallet',
  configName: 'cleartext-config',
  clearInvalidConfig: false,
});

console.log('conf', conf.get('accountBook'));

// seed, from secure storage.
const seed = '';

// from account, last known account in the blockchain.
const fromAccount = '';

// to account, the account in the address book you attempted to send to.
const toAccount = '';

const rpcUrl = 'https://kaliumapi.appditto.com/api';

describe('find lost camo', async () => {
  it('find lost camo works', async () => {
    console.log('seed', seed);
    const accountData = [];
    await accountUtil.setAccountDataFromSeed(rpcUrl, seed, accountData);
    // console.log('accountData', accountData);
    for (let accountDataIx = 0; accountDataIx < accountData.length; accountDataIx++) {
      const accountDataElt = accountData[accountDataIx];
      if (accountDataElt.account == fromAccount) {
        console.log('accountDataElt', accountDataElt);
        const seedIx = accountDataElt.seedIx;
        const fromPrivateKey = pawjs.pawUtil.getPrivateKey(seed, seedIx);
        const toPublicKey = pawjs.pawUtil.getAccountPublicKey(toAccount);
        const pawnodeApi = pawjs.pawnodeApi;
        const sharedSecret = await pawjs.camoUtil.getSharedSecretFromRepresentative( pawnodeApi, fromPrivateKey, toPublicKey );
        console.log('sharedSecret', sharedSecret);
        const sharedSecretAccountData = [];
        await accountUtil.setAccountDataFromSeed(rpcUrl, sharedSecret, sharedSecretAccountData);
        console.log('sharedSecretAccountData', sharedSecretAccountData);
      }
    }
    // expect(expectedTx).to.equal(actualTx);
  });
});
