var web3 = new Web3(Web3.givenProvider);

txtSearch = $('#txtSearch');
btnSearch = $('#btnSearch');

btnSearch.click(() =>{
  console.log("Search for: ", txtSearch.val());
});
