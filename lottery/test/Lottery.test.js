const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send( {from: accounts[0], gas: '1000000' } )
    console.log(accounts.length);
});

describe('Lottery Contract', async () =>{
    it('deploys a contract', () =>{
        assert.ok(lottery.options.address); //check if contract is deployed i.e. lottery.options.address is not null
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('.02', 'ether')

        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows mutiple account to enter', async() =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[4],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        console.log(players);
        

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(accounts[3], players[3]);
        assert.equal(accounts[4], players[4]);
    });

    it('requires a minimum acount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether')
            });
            assert(false); //if above method will not throw execption, the code will reach this line and test will fail.
        } catch (error) {
            //console.log(error);
            assert(error);
            
        }
        
    });

    it('only manager can call', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error)
        }
        /*await lottery.methods.pickWinner().send({
            from: accounts[0]
        });*/
        
    });

    it('pickWinner', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        
        const newBalance = await web3.eth.getBalance(accounts[0]);

        const difference = newBalance - initialBalance;
        console.log(String(difference));
        console.log(web3.utils.fromWei(String(difference), 'ether'));

        assert(difference > 1.8);


        


    });
});