const infuraUrl = 'https://mainnet.infura.io/v3/835d112a6b6043b2becf7ee5f739cac3';
var web3 = new Web3(infuraUrl);
var BN = web3.utils.BN;

const datasources = {
  live: 'LIVE',
  dev: 'DEV'
}
const DATASOURCE = datasources.live;
const PAGE_SIZE = 5;

(function () {

  txtSearch = $('#txtSearch');
  btnSearch = $('#btnSearch');

  btnSearch.click(() => {
    console.log("Search for: ", txtSearch.val());
  });

  async function getLatestBlockData() {
    let blocks = [];
    if (DATASOURCE == datasources.live) {
      console.log('Getting latest block...');
      let latest = await web3.eth.getBlock('latest', true)
      blocks.push(latest);
      for (let i = latest.number, count = 0; count < PAGE_SIZE; i--, count++) {
        let block = await web3.eth.getBlock(i, false);
        blocks.push(block);
      }

    } else {
      console.log('Getting test block data...');
      blocks = await $.getJSON('/assets/js/block-data-test.json');
    }
    console.log('latest block: ', blocks);
    return blocks;
  }

  function renderLatestTransactions(blocks) {
    // createBlockDetailCard(blocks[0]);
    createCardList($('#divLatestBlocks'), 'block', blocks);
    createCardList($('#divLatestTrans'), 'transaction', blocks[0]);
  }

  function createBlockDetailCard(block) {
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

    let divLatestBlocks = $('#divLatestBlocks');

    // block header
    let divBlockInfo = $('<div class="card bg-white" id="block-info"></div>')
      .append(`<div class="card-header bg-white">Latest Block #${block.number}</div>`);

    // details
    let blockCardBody = $('<div class="card-body"></div>');
    blockInfo.forEach(item => blockCardBody.append(`<p>${item.name}: ${item.val}</p>`));
    divBlockInfo.append(blockCardBody);
    divLatestBlocks.append(divBlockInfo);
  }

  function createCardList(container, type, data) {
    let cardTitle = type === 'block' ? "Blocks" : "Transactions";
    let divCardBody = $('<div class="card-body"></div>');
    let divCard = $('<div class="card bg-white mt-2"></div>')
      .append(`<div class="card-header bg-white">Latest ${cardTitle}</div>`)
      .append(divCardBody);
    
    if (type === 'block') {
      data.forEach(block => divCardBody.append(createBlockCardRow(block)));
    } else {
      data.transactions.forEach(trans => divCardBody.append(createTransCardRow(trans)));
    }

    container.append(divCard);
  }

  // function createTransCard(block) {
  //   let divLatestTrans = $('#divLatestTrans');
  //   let divTrans = $('<div class="card bg-white mt-2" id="trans-info"></div>')
  //     .append('<div class="card-header bg-white">Latest Transactions</div>');
  //   let transCardBody = $('<div class="card-body"></div>');
  //   divTrans.append(transCardBody);

  //   block.transactions.forEach(trans => transCardBody.append(createTransCardRow(trans)));
  //   divLatestTrans.append(divTrans);
  // }

  function createBlockCardRow(block) {
    let html = `
      <div class="row">
        <div class="col-sm-4">
          <div class="align-items-sm-center mb-1 media mr-4">
            <div class="d-sm-flex mr-2">
              <span class="btn btn-soft-secondary">Bk</span>
            </div>
            <div class="media-body">
              <a href="#">${block.number}</a>
              <span class="d-sm-block small text-secondary">XX ago</span>
            </div>
          </div>
        </div>
        <div class="col-sm-8">
          <div class="d-sm-flex justify-content-between">
            <div class="text-nowrap mr-4">
              <span>
                Miner <a class="hash-tag text-truncate" href="#">${block.miner}</a>
              </span>
              <span class="d-sm-block">
                <a class="hash-tag text-truncate" href="#">${block.transactions.length} txns</a>
                <span class="small text-secondary">in XX sec</span>
              </span>
            </div>
            <div>
              <span>X.XXXXX ETH</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="hr-space">
    `;
    // console.log('createTransRow html', html);
    return html;
  }

  function createTransCardRow(trans) {
    let html = `
      <div class="row">
        <div class="col-sm-4">
          <div class="media align-items-sm-center mb-1 mr-4">
            <div class="d-sm-flex mr-2">
              <span class="btn btn-soft-secondary rounded-circle">Tx</span>
            </div>
            <div class="media-body">
              <a class="hash-tag text-truncate" href="#">${trans.hash}</a>
              <span class="d-sm-block small text-secondary">XX ago</span>
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
    // console.log('createTransRow html', html);
    return html;
  }

  async function getLatestTransactiions() {
    let data = await getLatestBlockData();
    renderLatestTransactions(data);
  }

  getLatestTransactiions();

})();

