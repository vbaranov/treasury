require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should();
let data = require('./data.js');
let big = require('./util/bigNum.js').big;
let TestToken = artifacts.require('TestToken');
let {deployTestContracts} = require('./util/deploy.js');

contract('TestToken [all features]', function(accounts) {
    let {tokenContract} = {};

    beforeEach(async () => {
        ({tokenContract, treasuryContract} = await deployTestContracts(accounts));
    });

    it('constructor arguments set totalSupply', async () => {
        let token = await TestToken.new(100, 2);
        10000..should.be.bignumber.equal(await token.totalSupply());
    });

    it('decimals constructor argument', async () => {
        let token = await TestToken.new(100, 2);
        2..should.be.bignumber.equal(await token.decimals());
    });

    it('totalSupply', async() => {
        data.TOTAL_SUPPLY_ITEMS.mul(10**data.DECIMALS).should.be.bignumber.equal(
            await tokenContract.totalSupply()
        );
    });

    it('setTreasury fails for non-owner', async () => {
        await tokenContract.setTreasury(treasuryContract.address, {from: accounts[1]})
            .should.be.rejectedWith('invalid opcode');
    });

    it('setTreasury sets treasury contract', async () => {
        big(0).should.be.bignumber.equal(
            await tokenContract.treasury()
        );
        await tokenContract.setTreasury(treasuryContract.address);
        treasuryContract.address.should.be.equal(
            await tokenContract.treasury()
        );
    });

});


