var web3 = undefined;
var BN;

const datasources = {
    live: 'LIVE',
    dev: 'DEV'
}
const DATASOURCE = datasources.dev;
// const DATASOURCE = datasources.live;

const PAGE_SIZE = 5;
cachedBlocks = [];

const initWeb3 = async function () {
    if (web3 != undefined) {
        console.log('web3 already defined', web3);
        return web3;
    }
    const config = await $.getJSON('../../config.json');
    // console.log('config: ', config);
    web3 = new Web3(`https://mainnet.infura.io/v3/${config.infuraId}`);
    BN = web3.utils.BN;

    return web3;
};

async function search(txHash) {
    if (!txHash) {
        return;
    }

    let block, tx;
    let i = 0;
    let found = false;
    while (!found && i < cachedBlocks.length) {
        let b = cachedBlocks[i];
        // console.log(i, 'searching block ', b);
        tx = b.transactions.find(t => {
            if (t.hash == txHash) {
                block = b;
                return true;
            }
            return false;
        });
        if (tx) {
            // console.log('found it: ', tx);
            found = true;
        }
        i++;
    }

    if (!tx) {
        console.log('tx not found in cache. querying web3');
        tx = await web3.eth.getTransaction(txHash);

        if (tx) {
            console.log('web3 found tx: ', tx);
            block = await web3.eth.getBlock(tx.blockNumber);
        } else {
            console.log(`transaction with hash "${txHash}" not found!`);
        }
    }
    return {
        block: block,
        trans: tx
    };
}

async function getLatestBlockData() {
    let blocks = [];
    if (DATASOURCE == datasources.live) {
        console.log('Getting latest block...');
        let latest = await web3.eth.getBlock('latest', true)
        blocks.push(latest);
        for (let i = latest.number - 1, count = 0; count < PAGE_SIZE; i--, count++) {
            let block = await web3.eth.getBlock(i, true);
            blocks.push(block);
        }

    } else {
        console.log('Getting test block data...');
        blocks = await $.getJSON('/assets/js/block-data-test.json');
    }

    // save the data
    cachedBlocks = blocks;
    console.log('latest blocks: ', blocks);

    return blocks;
}

async function findBlock(blockNumber) {
    let block = cachedBlocks.find(b => b.number === blockNumber);
    if (!block) {
        block = await web3.eth.getBlock(blockNumber, true);
        cachedBlocks.push(block);

    }

    return block;
}

function calcBlockReward(block) {
    // block rewards
    // https://eth.wiki/fundamentals/mining
    // https://ethereum.stackexchange.com/questions/28016/how-to-get-the-full-miner-reward
  
    let blockReward;
    if (block.number >= 7280000) {
      // EIP 1234
      blockReward = new BN(web3.utils.toWei('2', 'ether'));
    } else if (block.number >= 4370000) {
      // EIP 649
      blockReward = new BN(web3.utils.toWei('3', 'ether'));
    } else {
      // original
      blockReward = new BN(web3.utils.toWei('5', 'ether'));
    }
  
    // gas rewards
    let totalGasFees = new BN('0');
    let totalGas = new BN('0');
    block.transactions.forEach((trans, i) => {
      let gas = trans.gas ?
        new BN(trans.gas.toString())
        : new BN('0');
      totalGas = totalGas.clone().add(gas);
      let price = new BN(trans.gasPrice);
      let fees = gas.clone().mul(price);
      totalGasFees = totalGasFees.clone().add(fees);
    });
  
    let avgGasPrice = totalGasFees.div(totalGas);
    let gasUsed = new BN(block.gasUsed);
    let gasFeesConsumed = avgGasPrice.mul(gasUsed);
  
    // uncle rewards
    // TODO: calc uncle rewards
    let totalUncleRewards = new BN('0');
  
    let totalRewards = blockReward
      .add(gasFeesConsumed)
      .add(totalUncleRewards);
    // console.log(
    //   'block reward', displayEthValue(blockReward),
    //   'total gas fees', displayEthValue(totalGasFees),
    //   'total uncle rewards', displayEthValue(totalUncleRewards),
    //   'total block rewards: ', displayEthValue(totalRewards));
  
    return totalRewards;
  }
  
  function calcTransFee(trans) {
    let gas = new BN(trans.gas.toString());
    let price = new BN(trans.gasPrice);
    return gas.mul(price);
  }