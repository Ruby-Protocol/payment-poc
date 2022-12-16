// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts//presets/ERC20PresetMinterPauser.sol";

contract TestRubyToken is ERC20PresetMinterPauser {

    constructor() ERC20PresetMinterPauser("TestRubyToken", "Ruby") public {
    }

}
