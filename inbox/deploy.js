const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');


const provider = new HDWalletProvider(
    'vacuum music whisper vessel defense about helmet legend bronze digital chalk wrist',
    'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attpting to deploy the account ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    //.deploy( { data: bytecode, arguments: ['Hi there!'] } )
    .deploy({data: '0x' + bytecode, arguments: ['Hi there!']})
    .send( { gas: '1000000', from: accounts[0] } );
    

    console.log('Contract deployed :', result.options.address);
    //Contract deployed : 0x16B9D7482BE53f82B37e3ba43307E6648357C294
}
deploy();


