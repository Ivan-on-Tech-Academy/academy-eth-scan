function createCardList(container, type, data) {
    container.empty();
    let cardTitle = type === 'block' ? "Blocks" : "Transactions";
    let divCardBody = $('<div class="card-body"></div>');
    let divCard = $('<div class="card bg-white mt-2"></div>')
      .append(`<div class="card-header bg-white">Latest ${cardTitle}</div>`)
      .append(divCardBody);

    if (type === 'block') {
      for (let i = 0; i < PAGE_SIZE; i++) {
        let block = data[i];
        let prevBlock = data[i + 1];
        divCardBody.append(createBlockCardRow(block, prevBlock));
      }
    } else {
      data.transactions.forEach(trans => divCardBody.append(createTransCardRow(trans, data)));
    }

    container.append(divCard);
  }

  function createBlockCardRow(block, prevBlock) {
    let html = `
      <div class="row">
        <div class="col-sm-4">
          <div class="align-items-sm-center mb-1 media mr-4">
            <div class="d-sm-flex mr-2">
              <span class="btn btn-soft-secondary">Bk</span>
            </div>
            <div class="media-body">
              <a class="block-link" href="detail.html?block=${block.number}">${block.number}</a>
              <span class="d-sm-block small text-secondary">${getAgoText(block.timestamp)}</span>
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
                <a class="hash-tag text-truncate block-trans-link" href="detail.html?block=${block.number}">${block.transactions.length} txns</a>
                <span class="small text-secondary">${getSecAgoText(block.timestamp, prevBlock.timestamp)}</span>
              </span>
            </div>
            <div>
              <span class="text-secondary">${displayEthValue(calcBlockReward(block))}</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="hr-space">
    `;
    // console.log('createTransRow html', html);
    return html;
  }

  function createTransCardRow(trans, block) {
    let html = `
      <div class="row">
        <div class="col-sm-4">
          <div class="media align-items-sm-center mb-1 mr-4">
            <div class="d-sm-flex mr-2">
              <span class="btn btn-soft-secondary rounded-circle">Tx</span>
            </div>
            <div class="media-body">
              <a class="hash-tag text-truncate" href="detail.html?block=${block.number}&trans=${trans.hash}">${trans.hash}</a>
              <span class="d-sm-block small text-secondary">${getAgoText(block.timestamp)}</span>
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
              <span class="text-secondary">${displayEthValue(calcTransFee(trans))}</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="hr-space">
    `;
    // console.log('createTransRow html', html);
    return html;
  }
