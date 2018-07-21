const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Lottery'];