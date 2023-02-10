import $ from 'jquery'
import Web3 from 'web3'
const Client = require("./ruby/ruby");

const rubyApp = {
  web3Provider: null,
  contracts: {
      rubyETHContract: null,
      rubyERC20Contract: null,
      erc20TokenContract: null
  },
    rubyClient: null,
    alice_address: '0xfb8C80F8143E5baF936fc5c6E73bB07A0a247D10',
    //alice_secret: '22fE54326C85b427E9AC771e3EBbDc23f41aCf5b',
    bob_address: '0xfc71E218fFF23fa5Da59bA02684e9393e84ff523',
    //bob_secret: '10Eb73f9c463fF3302760bF0eFD8bBD7Cc751124',

  init: function(net) {
    return rubyApp.initWeb3(net);
  },

  initWeb3: async function(net) {
    // Modern dApp browsers
    if (window.ethereum) {
        rubyApp.web3Provider = window.ethereum;
        try {
            // Request account access
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access
            console.error("User denied account access");
        }
        console.log("using modern dApp browser");
    }
    // Legacy dApp browsers
    else if (window.web3) {
        rubyApp.web3Provider = window.web3.currentProvider;
        console.log("using legacy dApp browser");
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
        //rubyApp.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        rubyApp.web3Provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/f0133270d95d492aa5d4bb8944b36bc6");
        console.log("using ropsten");
    }
    rubyApp.web3 = new Web3(rubyApp.web3Provider);

    return rubyApp.initContract(net);
  },

  initContract: async function(net) {
    console.log('initContract', net)
      const addresses = {
        ETH: '0xa391554CE9Dd3E504CADa7BD369Bf9d8Af59646e',
        // ETH: '0xB391C0327Ad4cA4bD001257A6B0A9ff43532f5ab', //test
        Arbitrum: '0xb7c767237C6B7193f9d7bbFAE4743f3c181E3aD3'
      }
      const folders = {
        ETH: 'contracts_op',
        // ETH: 'contracts_local', //test
        Arbitrum: 'contracts_arbi'
      }
      /* Bsc testnet contract address */
      console.log('folder:', folders[net], addresses[net])
      let rubyETHabi = (await $.getJSON(folders[net]+'/RubyETH.json')).abi;
      rubyApp.contracts.rubyETHContract = new rubyApp.web3.eth.Contract(rubyETHabi, addresses[net]);
      rubyApp.contracts.rubyETHContract.setProvider(rubyApp.web3Provider);

    //   let rubyERC20abi = (await $.getJSON('contracts/RubyERC20.json')).abi;
    //   rubyApp.contracts.rubyERC20Contract = new rubyApp.web3.eth.Contract(rubyERC20abi, '0x2B27cd5BF14fC2e138A2456B9b30A1aC51926839');
    //   rubyApp.contracts.rubyERC20Contract.setProvider(rubyApp.web3Provider);

    //   let erc20abi = (await $.getJSON('contracts/TestRubyToken.json')).abi;
    //   rubyApp.contracts.erc20TokenContract = new rubyApp.web3.eth.Contract(erc20abi, '0xf4E4457b708A2d3EE05E89F62fF119515029e9e8');
    //   rubyApp.contracts.erc20TokenContract.setProvider(rubyApp.web3Provider);
   

      return rubyApp
  },

   
    initRubyEthClient: async function ()  {
        let accounts = await rubyApp.web3.eth.getAccounts();
        this.rubyClient = new Client.ClientRubyETH(
            rubyApp.web3,
            rubyApp.contracts.rubyETHContract,
            accounts[0] 
        );
        await this.rubyClient.init();

        //if (accounts[0] == this.alice_address)
            //this.secret = this.alice_secret;
        //else if (accounts[0] == this.bob_address)
            //this.secret = this.bob_secret;

        // Use the address without '0x' as the secret
        // this.secret = accounts[0].slice(2);
        console.log("Initialization completed.");
        return accounts[0]
    },
    rubyEthLogin: async function (secret) {
        this.secret = secret
        return await this.rubyClient.login(secret)
    },
    rubyEthRegister: async function (secret) {
        await this.rubyClient.register(secret);
        console.log(
            'keypair: ',
            this.rubyClient.account.keypair
        );
    },

    rubyEthDeposit: async function (value) {
        await this.rubyClient.register(this.secret);
        await this.rubyClient.mint(value);
    },

    rubyEthWithdraw: async function (value) {
        await this.rubyClient.register(this.secret);
        await this.rubyClient.redeem(value);
    },

    // get balance
    rubyEthBalance: async function () {
        // console.log('this.secret: ', this.secret);
        // await this.rubyClient.register(this.secret);
        let balance = await this.rubyClient.readBalanceFromContract();
        return balance
    },

    rubyEthAddress: async function () {
        return this.rubyClient.account.publicKeyEncoded()
    },

    rubyEthTransfer: async function (remoteAddress, value) {
        await this.rubyClient.transfer(remoteAddress, value);
    },
    
    


    mintERC20Token: async function () {
        let accounts = await rubyApp.web3.eth.getAccounts(); 
        await new Promise((resolve, reject) => {
            rubyApp.contracts.erc20TokenContract.methods.mint(accounts[0], "20000000000000000000000000")
                .send({from: accounts[0], gas: 4700000})
                .on('transactionHash', (hash) => {
                    console.log("Mint submitted (txHash = \"" + hash + "\").");
                })
                .on("receipt", (receipt) => {
                    rubyApp.contracts.erc20TokenContract.methods.balanceOf(accounts[0])
                        .call()
                        .then((result) => {
                            console.log("ERC20 funds minted (balance = " + result + ").");
                            resolve(receipt);
                        });
                })
                .on("error", (error) => {
                    reject(error);
                });
        });
    },
    initRubyERC20Client: async function ()  {
        let accounts = await rubyApp.web3.eth.getAccounts();
        console.log('accounts: ', accounts);
        this.rubyClient = new Client.ClientRubyERC20(
            rubyApp.web3,
            rubyApp.contracts.rubyERC20Contract,
            accounts[0],
            rubyApp.contracts.erc20TokenContract
        );
        await this.rubyClient.init();

        //if (accounts[0] == this.alice_address)
            //this.secret = this.alice_secret;
        //else if (accounts[0] == this.bob_address)
            //this.secret = this.bob_secret;

        // Use the address without '0x' as the secret
        this.secret = accounts[0].slice(2);
        console.log("Initialization completed.");
    },

    rubyERC20Register: async function () {
        await this.rubyClient.register(this.secret);
        console.log(
            'keypair: ',
            this.rubyClient.account.keypair
        );
    },

    rubyERC20Deposit: async function () {
        await this.rubyClient.register(this.secret);
        await this.rubyClient.mint(10);
    },

    rubyERC20Withdraw: async function () {
        await this.rubyClient.register(this.secret);
        await this.rubyClient.redeem(5);
    },

    rubyERC20Balance: async function () {
        console.log('this.secret: ', this.secret);
        await this.rubyClient.register(this.secret);
        // let balance = await this.rubyClient.readBalanceFromContract();
    },

    rubyERC20Address: async function () {
        console.log('ruby address: ', this.rubyClient.account.publicKeyEncoded());
    },

    rubyERC20Transfer: async function () {
        var address = $('#TransferRubyERC20Address').val();
        var decoys = $('#TransferRubyERC20Decoys').val().split(',').filter(x => x!='');
        await this.rubyClient.transfer(address, 5, decoys);
    },



};

export default rubyApp
