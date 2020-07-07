/*
  Formatting
*/
const fmt = {
  c: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 }),
  c0: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  n0: new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 0 }),
  n2: new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }),
  n5: new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 5 }),
  p2: new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

function displayEthValue(value) {
  let ethValue = Number(web3.utils.fromWei(value || '0', 'ether'));
  return `${fmt.n5.format(ethValue)} ETH`;
}

function getSecAgoText(timestamp, prevTimestamp) {
  let a = moment.unix(timestamp);
  let b = moment.unix(prevTimestamp);
  let secs = a.diff(b, 'seconds');
  return `in ${secs} sec${secs > 0 ? "s" : ""}`;
}

function getAgoText(timestamp, prevTimestamp) {
  let a = moment.unix(timestamp);
  if (prevTimestamp) {
    b = moment.unix(prevTimestamp);
  } else {
    b = moment();
  }

  return a.from(b);
}
