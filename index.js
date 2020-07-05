const infuraUrl = 'https://mainnet.infura.io/v3/835d112a6b6043b2becf7ee5f739cac3';
var web3 = new Web3(infuraUrl);
var BN = web3.utils.BN;

const datasources = {
  live: 'LIVE',
  dev: 'DEV'
}
const DATASOURCE = datasources.dev;
const PAGE_SIZE = 5;

(function () {

  txtSearch = $('#txtSearch');
  btnSearch = $('#btnSearch');

  btnSearch.click(async () => {
    console.log("Search for: ", txtSearch.val());
    let trans = {};
    if (DATASOURCE == datasources.live) {
      trans = await search(txtSearch.val());
    } else {
      let blocks = await getLatestBlockData();
      trans = blocks[0].transactions[0];
    }
    console.log('search results: ', trans);
    renderTransDetailCard(trans);
  });

  async function search(txHash) {
    if (!txHash) {
      return;
    }
    let tx = await web3.eth.getTransaction(txHash);
    return tx;
  }

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
    $('#detail').hide();
    createCardList($('#divLatestBlocks'), 'block', blocks);
    createCardList($('#divLatestTrans'), 'transaction', blocks[0]);
    $('#latest').show();
  }

  function createCardList(container, type, data) {
    container.empty();
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

  function createBlockCardRow(block) {
    let html = `
      <div class="row">
        <div class="col-sm-4">
          <div class="align-items-sm-center mb-1 media mr-4">
            <div class="d-sm-flex mr-2">
              <span class="btn btn-soft-secondary">Bk</span>
            </div>
            <div class="media-body">
              <a class="block-link" href="#">${block.number}</a>
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
                <a class="hash-tag text-truncate block-trans-link" href="#">${block.transactions.length} txns</a>
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

  /*
    Detail views
  */

  function renderTransDetailCard(trans) {
    const transInfo = [
      { name: "Transaction Hash:", value: trans.hash },
      { name: "Status:", value: trans.blockHash ? "Confirmed" : "Pending" },
      { name: "Block:", value: trans.blockNumber },
      { name: "Timestamp:", value: "calc this" },
      { name: "From:", value: trans.from },
      { name: "To:", value: trans.to },
      { name: "Value", value: trans.value },
      {
        name: "Transaction Fee", value: (() => {
          let gasPrice = new BN(trans.gasPrice);
          let gasProvided = new BN(trans.gas);
          let fee = gasProvided.mul(gasPrice);
          return `${web3.utils.fromWei(fee, "ether")} ETH`;
        })()
      },
    ];
    renderDetailCard(transInfo, "Transaction");
  }

  function renderBlockDetailCard(block) {
    const blockInfo = [
      { name: "Block Height", value: block.number },
      { name: "Timestamp", value: new Date(block.timestamp) },
      { name: "Transactions", value: block.transactions.length },
      { name: "Mined By", value: block.miner },
      { name: "Block Reward", value: "need to calc this" },
      { name: "Difficulty", value: block.difficulty },
      { name: "Size", value: block.size },
      { name: "Gas Used", value: block.gasUsed },
      { name: "Gas Limit", value: block.gasLimit },
      { name: "Extra Data", value: block.extraData }
    ];
    renderDetailCard(blockInfo, 'Block');
  }

  function renderDetailCard(items, type) {
    $('#latest').hide();
    let divDetail = $('#detail');

    let cardBody = $('<div class="card-body"></div>');
    let divCard = $('<div class="card bg-white mt-2" id="block-info"></div>')
      .append(`<div class="card-header bg-white font-weight-bold">${type} Details</div>`)
      .append(cardBody);

    // rows
    items.forEach(item => cardBody.append(`
    <div class="row align-items-center mt-1">
      <div class="col-md-3 font-weight-bold">${item.name}</div>
      <div class="col-md-9">${item.value}</div>      
    </div>
    <hr class="hr-space">
    `));

    divDetail
      .empty()
      .append(divCard)
      .show();
  }

  /* 
    Event handlers
  */

  $('#latest').on('click', 'a.block-link', () => onBlockLinkClicked())

  async function onBlockLinkClicked() {
    let link = $('this');
    let blockNumber = link.prevObject[0].activeElement.innerText;
    console.log('block link clicked: ', blockNumber);

    let block = await findBlock(blockNumber);
    console.log('block: ', block);
    renderBlockDetailCard(block);
  }

  function findBlock(blockNumber) {
    return web3.eth.getBlock(blockNumber);
  }

  // render default view
  getLatestTransactiions();

})();
