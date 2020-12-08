import fs from 'fs';

/**
 * 股票成本 =（总投入资金-总回收资金）/现在总股数
 */

/**
 * 手续费
 */
const transfer_fee = 0.00002

/**
 * 印花税
 */
const stamp_duty = 0.001

/**
 * 佣金
 */
const commission = 0.00025

/**
 * 当前股数
 */
var numberOfShares = 0

/**
 * 总投入资金
 */
var totalInvestFunds = 0;

/**
 * 总回收资金
 */
var totalRetrievingFunds = 0;

/**
 * 当前成本
 */
var currentCost = 0;

function parseData() {
    const data = fs.readFileSync('./dog-egg.txt').toString().split('\n');
    data.filter(function (value) {
        return value.trim().length > 0
    }).forEach(function (value, index) {
        const line = value.split(/\s+/)
        currentCost = calculate(line[0], parseFloat(line[1]), parseInt(line[2]))
    })
}

function calculate(operate, price, count) {
    if (operate == 'B') {
        return buy(price, count);
    } else if (operate == 'S') {
        return sell(price, count);
    }
}

function buy(price, count) {
    numberOfShares += count;
    var transationAmount = price * count;
    totalInvestFunds += transationAmount + calculateCommission(transationAmount) + transationAmount * transfer_fee;
    const cost = (totalInvestFunds - totalRetrievingFunds) / numberOfShares;
    console.log(`buy price: ${price}; count: ${count}; cost: ${cost}`);
    return (totalInvestFunds - totalRetrievingFunds) / numberOfShares;
}

function sell(price, count) {
    var transationAmount = price * count;
    totalRetrievingFunds += transationAmount - calculateCommission(transationAmount) - transationAmount * stamp_duty - transationAmount * transfer_fee;;
    numberOfShares -= count;
    if (numberOfShares == 0) {
        const cost = 0;
        console.log(`sell price: ${price}; count: ${count}; cost: ${cost}`);
        return 0;
    } else {
        const cost = (totalInvestFunds - totalRetrievingFunds) / numberOfShares;
        console.log(`sell price: ${price}; count: ${count}; cost: ${cost}`);
        return (totalInvestFunds - totalRetrievingFunds) / numberOfShares;
    }
}

function calculateCommission(amount) {
    const c = amount * commission
    return c > 5 ? c : 5
}

function updateReadMe() {
    const readmeContent = `
狗蛋当前成本：**${currentCost}**\n
`
    fs.writeFileSync('./README.md', readmeContent, 'utf-8');
}

parseData()

updateReadMe()