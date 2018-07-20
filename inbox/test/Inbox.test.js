const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts; 
let inbox;

beforeEach (async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] }) 
        .send({ from: accounts[0], gas: '1000000'} );

    inbox.setProvider(provider);    

});

describe ('Inbox', () => {
    it('deploys a contract', () =>{
        //console.log(inbox);
        console.log(inbox.options.address)
        assert.ok(inbox.options.address);

    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!');
    });

    it('can change the message', async () =>{
        await inbox.methods.setMessage('bye').send( { from: accounts[0] } );
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});

/*it('default message'), () =>{
        console.log(inbox);
        assert.equal(inbox.message(), 'Hi there!'); 
});*/

/*class Car{
    park(){
        return 'stopped';
    }

    drive(){
        return 'vroom';
    }
}

let car;
beforeEach(() => {
    car = new Car();
});
describe('Car', () => {
    it('park', () => {
        
        assert.equal(car.park(), 'stopped'); 
    });
});*/