/*
  Detail views
*/

// determine which view to render
(async function () {
    await initWeb3();

    let params = getUrlParameters();
    console.log('detail view params: ', params);

    if (params.trans) {
        let result = await search(params.trans);
        renderTransDetailCard(result.trans, result.block);
    } else {
        let block = await findBlock(params.block);
        renderBlockDetailCard(block);
    }
})();

function renderTransDetailCard(trans, block) {
    const transInfo = [
        { name: "Transaction Hash:", value: trans.hash },
        { name: "Status:", value: trans.blockHash ? "Confirmed" : "Pending" },
        { name: "Block:", value: trans.blockNumber },
        { name: "Timestamp:", value: getAgoText(block.timestamp) },
        { name: "From:", value: trans.from },
        { name: "To:", value: trans.to },
        { name: "Value", value: displayEthValue(trans.value) },
        {
            name: "Transaction Fee", value: (() => {
                let gasPrice = new BN(trans.gasPrice);
                let gasProvided = new BN(trans.gas);
                let fee = gasProvided.mul(gasPrice);
                return displayEthValue(fee);
            })()
        },
    ];
    renderDetailCard(transInfo, "Transaction");
}

function renderBlockDetailCard(block) {
    const blockInfo = [
        { name: "Block Height", value: block.number },
        { name: "Timestamp", value: getAgoText(block.timestamp) },
        { name: "Transactions", value: block.transactions.length },
        { name: "Mined By", value: block.miner },
        { name: "Block Reward", value: displayEthValue(calcBlockReward(block)) },
        { name: "Difficulty", value: fmt.n0.format(block.difficulty) },
        { name: "Size", value: `${fmt.n0.format(block.size)} bytes` },
        { name: "Gas Used", value: `${fmt.n0.format(block.gasUsed)} (${fmt.p2.format(block.gasUsed / block.gasLimit)})` },
        { name: "Gas Limit", value: fmt.n0.format(block.gasLimit) },
        { name: "Extra Data", value: block.extraData },
    ];
    renderDetailCard(blockInfo, 'Block');
}

function renderDetailCard(items, type) {
    $('#latest').hide();
    let divDetail = $('#app-detail');

    let cardBody = $('<div class="card-body"></div>');
    let divCard = $('<div class="card bg-white mt-4" id="block-info"></div>')
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
