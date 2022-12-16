const ClientRubyERC20 = require('../client_rubyerc20.js'); 
const Deployer = require('./deployer.js');
const Web3 = require("web3");
const RubyETH = require("../../build/contracts/RubyETH.json");
const RubyERC20 = require("../../build/contracts/RubyERC20.json");
const TestERC20Token = require("../../build/contracts/TestERC20Token.json");


class WsProvider {
    constructor(address) {
        this.getProvider = () => {
            const provider = new Web3.providers.WebsocketProvider(address);
            return new Promise((resolve, reject) => {
                provider.on("connect", () => resolve(provider));
                provider.on("error", (error) => reject(error));
            });
        };
    }
}

const run = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    const accounts = await web3.eth.getAccounts();
    const agency = accounts[5];

    var deployer = new Deployer(accounts);
    const [
        cash, [transfer, burn]
    ] = await Promise.all([deployer.deployTestERC20Token().then((result) => result.contractAddress), deployer.deployInnerProductVerifier().then((result) => {
        ip = result.contractAddress;
        return Promise.all([deployer.deployTransferVerifier(ip), deployer.deployBurnVerifier(ip)]).then((results) => results.map((result) => result.contractAddress));
    })]);

    const ruby = await Promise.all([deployer.deployRubyERC20(agency, cash, transfer, burn, 1, 12, 1), deployer.mintTestERC20Token(cash, 1000)]).then((results) => results[0].contractAddress);
    const deployedRuby = new web3.eth.Contract(RubyERC20.abi, ruby);
    const deployedERC20 = new web3.eth.Contract(TestERC20Token.abi, cash);

    const alice = new ClientRubyERC20(web3, deployedRuby, accounts[0], deployedERC20);
    await alice.init();
    await alice.register();
    await alice.deposit(100);
    await alice.withdraw(10);
    //const bob = new Client(web3, deployed, accounts[0], deployedERC20);
    //await bob.init();
    //await bob.register();
    //await alice.transfer('Bob', 10);
};


run().catch(console.error);
