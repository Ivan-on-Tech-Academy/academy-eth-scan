const infuraUrl = 'https://mainnet.infura.io/v3/835d112a6b6043b2becf7ee5f739cac3';
var web3 = new Web3(infuraUrl);

const datasources = {
  live: 'LIVE',
  dev: 'DEV'
}
const DATASOURCE = datasources.live;

(function () {

  txtSearch = $('#txtSearch');
  btnSearch = $('#btnSearch');

  btnSearch.click(() => {
    console.log("Search for: ", txtSearch.val());
  });

  async function getLatestBlockData() {
    let block = {};
    if (DATASOURCE == datasources.live) {
      console.log('Getting latest block...');
      block = await web3.eth.getBlock('latest', true);
    } else {
      console.log('Getting test block data...');
      block = await $.getJSON('/assets/js/block-data-test.json');
    }
    console.log('latest block: ', block);
    return block;
  }

  function renderLatestTransactions(block) {
    const blockInfo = [
      { name: "Timestamp", val: new Date(block.timestamp) },
      { name: "Transactions", val: block.transactions.length },
      { name: "Mined By", val: block.miner },
      { name: "Block Reward", val: "need to calc this" },
      { name: "Difficulty", val: block.difficulty },
      { name: "Size", val: block.size },
      { name: "Gas Used", val: block.gasUsed },
      { name: "Gas Limit", val: block.gasLimit },
      { name: "Extra Data", val: block.extraData }
    ];
    let divLatestTrans = $('#divLatestTrans');
    divLatestTrans.append(`<h5>Block #${block.number}</h5>`);

    blockInfo.forEach(item => divLatestTrans.append(`<p>${item.name}: ${item.val}</p>`));
  }

  async function getLatestTransactiions() {
    let data = await getLatestBlockData();
    renderLatestTransactions(data);
  }

  getLatestTransactiions();

})();

