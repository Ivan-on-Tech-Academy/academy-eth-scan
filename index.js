const infuraUrl = 'https://mainnet.infura.io/v3/835d112a6b6043b2becf7ee5f739cac3';
var web3 = new Web3(infuraUrl);
var BN = web3.utils.BN;

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
    const tableInfo = [
      { header: "Txn Hash", value: trans => trans.hash },
      // { header: "Block", value: trans => trans.blockNumber },
      // { header: "Age", value: "caclulated" },
      { header: "From", value: trans => trans.from },
      { header: "To", value: trans => trans.to },
      { header: "Value", value: trans => web3.utils.fromWei(trans.value, "ether") },
      {
        header: "[Txn Fee]",
        value: trans => {
          let fee = new BN(trans.gasPrice).mul(new BN(trans.gas));
          return web3.utils.fromWei(fee, "ether");
        }
      },
    ];

    let divLatestTrans = $('#divLatestTrans');

    // block header
    let divBlockInfo = $('<div class="card bg-white" id="block-info"></div>')
      .append(`<div class="card-header bg-white">Latest Block #${block.number}</div>`);

    let blockCardBody = $('<div class="card-body"></div>');
    blockInfo.forEach(item => blockCardBody.append(`<p>${item.name}: ${item.val}</p>`));
    divBlockInfo.append(blockCardBody);
    divLatestTrans.append(divBlockInfo);

    // transactions
    let divTrans = $('<div class="card bg-white mt-2" id="trans-info"></div>')
      .append('<div class="card-header bg-white">Latest Transactions</div>');
    let transCardBody = $('<div class="card-body"></div>');
    divTrans.append(transCardBody);

    block.transactions.forEach(trans => transCardBody.append(createTransCardRow(trans)));    
    divLatestTrans.append(divTrans);
  }

  function createTransCardRow(trans) {
    let html = `
      <div class="row">
        <div class="col-sm-4">
          <div class="align-items-sm-center mb-1 media mr-4">
            <div class="d-sm-flex mr-2">
              <span class="btn btn-soft-secondary rounded-circle">Tx</span>
            </div>
            <div class="media-body">
              <a class="hash-tag text-truncate" href="#">${trans.hash}</a>
              <span>XX ago</span>
            </div>
          </div>
        </div>
        <div class="col-sm-8">
          <div class="d-sm-flex justify-content-between">
            <div class="text-nowrap mr-4">
              <span>
                From <a class="hash-tag text-truncate" href="#">${trans.from}</a>
              </span>
              <span class="d-sm-block">
                To <a class="hash-tag text-truncate" href="#">${trans.to}</a>
              </span>
            </div>
            <div>
              <span>${web3.utils.fromWei(trans.value, "ether")} ETH</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="hr-space">
    `;
    console.log('createTransRow html', html);
    return html;
  }

  async function getLatestTransactiions() {
    let data = await getLatestBlockData();
    renderLatestTransactions(data);
  }

  getLatestTransactiions();

})();

