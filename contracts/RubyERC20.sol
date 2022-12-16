// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Utils.sol";
import "./RubyBase.sol";


contract RubyERC20 is RubyBase {

    ERC20 token;

    constructor(address _token, address _transfer, address _redeem, uint256 _unit) RubyBase(_transfer, _redeem, _unit) public {
        token = ERC20(_token);
    }

    function mint(Utils.G1Point memory y, uint256 unitAmount, bytes memory encGuess) public {
        mintBase(y, unitAmount, encGuess);

        uint256 nativeAmount = toNativeAmount(unitAmount);

        // In order for the following to succeed, `msg.sender` have to first approve `this` to spend the nativeAmount.
        require(token.transferFrom(msg.sender, address(this), nativeAmount), "[Ruby mint] Native 'transferFrom' failed.");
    }

    function redeem(Utils.G1Point memory y, uint256 unitAmount, Utils.G1Point memory u, bytes memory proof, bytes memory encGuess) public {
        uint256 nativeAmount = toNativeAmount(unitAmount);
        uint256 fee = nativeAmount * redeem_fee_numerator / redeem_fee_denominator; 

        redeemBase(y, unitAmount, u, proof, encGuess);

        if (fee > 0) {
            require(token.transfer(ruby_agency, fee), "[Ruby redeem] Fail to charge fee.");
            redeem_fee_log = redeem_fee_log + fee;
        }
        require(token.transfer(msg.sender, nativeAmount - fee), "[Ruby redeem] Fail to transfer tokens.");
    }
}


