
$('document').ready(function () {

  txtSearch = $('#txtSearch');
  btnSearch = $('#btnSearch');


  btnSearch.click(async () => {
    if (!txtSearch.val()) {
      return;
    }
    console.log("Search for: ", txtSearch.val().trim());

    let result = await search(txtSearch.val());
    console.log('search results: ', result);

    renderTransDetailCard(result.trans, result.block);
  });


  function renderLatestTransactions(blocks) {
    $('#detail').hide();
    createCardList($('#divLatestBlocks'), 'block', blocks);
    createCardList($('#divLatestTrans'), 'transaction', blocks[0]);
    $('#latest').show();
  }

  async function getLatestTransactiions() {
    let data = await getLatestBlockData();
    renderLatestTransactions(data);
  }


  /* 
    Event handlers
  */

  // $('#latest').on('click', 'a.block-link', () => onBlockLinkClicked())

  // async function onBlockLinkClicked() {
  //   let link = $('this');
  //   let blockNumber = link.prevObject[0].activeElement.innerText;
  //   console.log('block link clicked: ', blockNumber);

  //   let block = await findBlock(blockNumber);
  //   console.log('block: ', block);
  //   renderBlockDetailCard(block);
  // }

  // render default view
  initWeb3().then(() => {
    console.log('web3: ', web3);
    getLatestTransactiions();
  });

});
