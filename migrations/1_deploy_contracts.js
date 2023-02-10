var TestRubyToken = artifacts.require("TestRubyToken");
var Utils = artifacts.require("Utils");
var RubyIP = artifacts.require("RubyIP");
var RubyRedeem = artifacts.require("RubyRedeem");
var RubyTransfer = artifacts.require("RubyTransfer");
var RubyETH = artifacts.require("RubyETH");
// var RubyERC20 = artifacts.require("RubyERC20");

module.exports = function(deployer) {

    console.log("Deploying Utils, TestRubyToken, RubyIP...");
    // return Promise.all([
    //     deployer.deploy(Utils),
    //     deployer.deploy(TestRubyToken),
    //     deployer.deploy(RubyIP)
    // ])
    // return deployer.deploy(Utils)
    // .then(() => {
    //     return deployer.deploy(TestRubyToken)
    // })
    // .then(() => {
        return deployer.deploy(RubyIP)
    // })
    .then(() => {
        console.log("Deploying RubyRedeem...");
        return Promise.all([
            deployer.deploy(RubyRedeem, RubyIP.address),
        ]);
    })
    .then(() => {
        console.log("Deploying RubyTransfer...");
        return Promise.all([
            deployer.deploy(RubyTransfer, RubyIP.address)
        ]);
    })
    .then(() => {
        console.log("Deploying RubyETH...");
        return Promise.all([
            // Should use string for large number. This seems to be a bug:
            // https://github.com/ethereum/web3.js/issues/2077
            deployer.deploy(RubyETH, RubyTransfer.address, RubyRedeem.address, "10000000000000000"),
        ]);
    })
    // .then(() => {
    //     console.log("Deploying RubyERC20...");
    //     return Promise.all([
    //         // Should use string for large number. This seems to be a bug:
    //         // https://github.com/ethereum/web3.js/issues/2077
    //         deployer.deploy(RubyERC20, TestRubyToken.address, RubyTransfer.address, RubyRedeem.address, "10000000000000000000000")
    //     ]);
    // });
};
