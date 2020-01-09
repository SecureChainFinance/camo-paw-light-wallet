'use strict';

// modules
const bananojsErrorTrap = require('./bananojs-error-trap-util.js');

// constants

// variables

// functions
const setAccountDataFromSeed = async (rpcUrl, seed, accountData) => {
  bananojsErrorTrap.setBananodeApiUrl(rpcUrl);
  let hasMoreHistoryOrPending = true;
  let seedIx = 0;
  accountData.length = 0;
  while (hasMoreHistoryOrPending) {
    // console.log('setAccountDataFromSeed', seedIx);
    const accountDataElt = {};
    accountDataElt.seedIx = seedIx;
    accountDataElt.privateKey = bananojsErrorTrap.getPrivateKey(seed, accountDataElt.seedIx);
    accountDataElt.publicKey = bananojsErrorTrap.getPublicKey(accountDataElt.privateKey);
    accountDataElt.account = bananojsErrorTrap.getAccount(accountDataElt.publicKey);
    accountData.push(accountDataElt);
    const accountHistory = await bananojsErrorTrap.getAccountHistory(accountDataElt.account, 1);
    const accountPending = await bananojsErrorTrap.getAccountsPending([accountDataElt.account], 1);
    accountDataElt.hasPending = false;
    if (accountPending) {
      if (accountPending.blocks) {
        const accountsPendingKeys = [...Object.keys(accountPending.blocks)];
        accountsPendingKeys.forEach((accountsPendingKey) => {
          const hashMap = accountPending.blocks[accountsPendingKey];
          if (hashMap) {
            const hashes = [...Object.keys(hashMap)];
            if (hashes.length > 0) {
              accountDataElt.hasPending = true;
            }
          }
        });
      }
    }
    if (accountHistory.history) {
      accountDataElt.hasHistory = true;
    } else {
      accountDataElt.hasHistory = false;
    }
    if (!accountDataElt.hasHistory) {
      if (!accountDataElt.hasPending) {
        hasMoreHistoryOrPending = false;
      }
    }
    seedIx++;
  }
};

// exports
exports.setAccountDataFromSeed = setAccountDataFromSeed;