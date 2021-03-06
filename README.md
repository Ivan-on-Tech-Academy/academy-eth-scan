# academy-eth-scan
An EtherScan clone example project for the bootcamp.<br>
https://etherscan.io/

**web3.js**

This project uses `web3.js` to connect to the Ethereum blockchain.<br>
https://github.com/ethereum/web3.js/
<br>Docs: https://web3js.readthedocs.io/en/v1.2.8/

Unfortunately there is no efficient on-chain way to search for transactions by address, so this will not be supported in this app. It could be implemented using web3js with a brute force linear search starting in the latest block and working backwards- but this would be horribly slow. Apparently Etherscan solves this by indexing data off-chain in a traditional database.

**Infura**

Instead of hosting a private Ethereum node this project connects to a free
hosted node offered by Infura. You will need to sign up for an account and create a project to get the necessary API keys. You can up to 3 active projects on the free account.

https://infura.io/


**Bootstrap**

https://getbootstrap.com/docs/4.5/getting-started/download/

**Setup**

Create a file in the main project directory called `config.json` and put your Infura project ID in it.

```json
{
    "infuraId": "yourProjectIdHere"
}
```

To switch the datasource between LIVE and DEV comment/uncomment the appropriate line in `assets/js/data-service.js`.
The test datasource has 5 blocks from the mainnet including all their transactions in `assets/js/block-data-test.json`.

```javascript
const datasources = {
    live: 'LIVE',
    dev: 'DEV'
}
const DATASOURCE = datasources.dev;
// const DATASOURCE = datasources.live;
```

**Running the project**

1. Open a terminal. Navigate to where you want to project to be.
2. `git clone https://github.com/Ivan-on-Tech-Academy/academy-eth-scan.git`
3. `cd academy-eth-scan`
4. `npm istall`
5. Run the website
   * Python2: `python -m SimpleHTTPServer`
   * Python3: `python3 -m http.server`
6. Open a web browser at `http://localhost:8000`
