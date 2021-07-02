const version = 1.5
console.log("Version", version)

const BitStampClient = require("./bitstampClient.js")
const configuration = require("./config.js")

//server.js
const url = require('url')
var express = require('express');
var app = express();
var session = require('express-session')
var stream = require('stream');

fs = require('fs');


const accounts = configuration.accounts
logInfo({ "accounts": accounts }, 3)

const defaultAccountName = configuration.defaultAccount.name
logInfo({ "default account name": defaultAccountName }, 3)
var defaultAccountKey
Object.keys(accounts).forEach(function (key, index) {

    if (accounts[key].name == defaultAccountName) {
        defaultAccountKey = key
    }
});
logInfo({ "default account key": defaultAccountKey }, 3)
currentAccountKey = defaultAccountKey
const defaultAccount = configuration.defaultAccount
logInfo({ "default account": defaultAccount }, 3)


var currentCurrency = defaultAccount.defaultCurrency.toLowerCase()
var currentCrypto = defaultAccount.defaultCrypto.toLowerCase()
logInfo({ "current currency": currentCurrency }, 3)
logInfo({ "current crypto": currentCrypto }, 3)
var client = new BitStampClient(configuration)

const path = require('path')

const pairs = { xrp_btc: "xrp_btc", uni_btc: "uni_btc", ltc_btc: "ltc_btc", link_btc: "link_btc", xlm_btc: "xlm_btc", bch_btc: "bch_btc", aave_btc: "aave_btc", algo_btc: "algo_btc", comp_btc: "comp_btc", snx_btc: "snx_btc", bat_btc: "bat_btc", mkr_btc: "mkr_btc", zrx_btc: "zrx_btc", yfi_btc: "yfi_btc", uma_btc: "uma_btc", omg_btc: "omg_btc", knc_btc: "knc_btc", crv_btc: "crv_btc", audio_btc: "audio_btc", eth_btc: "eth_btc", btc_usd: "btc_usd", xrp_usd: "xrp_usd", uni_usd: "uni_usd", ltc_usd: "ltc_usd", link_usd: "link_usd", xlm_usd: "xlm_usd", bch_usd: "bch_usd", aave_usd: "aave_usd", algo_usd: "algo_usd", comp_usd: "comp_usd", snx_usd: "snx_usd", bat_usd: "bat_usd", mkr_usd: "mkr_usd", zrx_usd: "zrx_usd", yfi_usd: "yfi_usd", uma_usd: "uma_usd", omg_usd: "omg_usd", knc_usd: "knc_usd", crv_usd: "crv_usd", audio_usd: "audio_usd", grt_usd: "grt_usd", dai_usd: "dai_usd", gusd_usd: "gusd_usd", gbp_usd: "gbp_usd", eur_usd: "eur_usd", eth_usd: "eth_usd", usdt_usd: "usdt_usd", usdc_usd: "usdc_usd", pax_usd: "pax_usd", btc_gbp: "btc_gbp", xrp_gbp: "xrp_gbp", ltc_gbp: "ltc_gbp", link_gbp: "link_gbp", xlm_gbp: "xlm_gbp", bch_gbp: "bch_gbp", omg_gbp: "omg_gbp", eth_gbp: "eth_gbp", pax_gbp: "pax_gbp", btc_eur: "btc_eur", xrp_eur: "xrp_eur", uni_eur: "uni_eur", ltc_eur: "ltc_eur", link_eur: "link_eur", xlm_eur: "xlm_eur", bch_eur: "bch_eur", aave_eur: "aave_eur", algo_eur: "algo_eur", comp_eur: "comp_eur", snx_eur: "snx_eur", bat_eur: "bat_eur", mkr_eur: "mkr_eur", zrx_eur: "zrx_eur", yfi_eur: "yfi_eur", uma_eur: "uma_eur", omg_eur: "omg_eur", knc_eur: "knc_eur", crv_eur: "crv_eur", audio_eur: "audio_eur", grt_eur: "grt_eur", gbp_eur: "gbp_eur", eth_eur: "eth_eur", usdt_eur: "usdt_eur", usdc_eur: "usdc_eur", pax_eur: "pax_eur", link_eth: "link_eth", eth_2eth: "eth_2eth", btc_usdt: "btc_usdt", xrp_usdt: "xrp_usdt", eth_usdt: "eth_usdt", usdc_usdt: "usdc_usdt", btc_usdc: "btc_usdc", eth_usdc: "eth_usdc", btc_pax: "btc_pax", xrp_pax: "xrp_pax", eth_pax: "eth_pax", }


process.once('SIGINT', function (code) {
    console.log('SIGINT received, shutting down...');
    process.exit()
});


app.use(session({
    secret: 'chosen language',
    saveUninitialized: true,
    resave: false,
}))

// app.use(express.static('./html')); // set default directory

//setting the port.
var server = app.listen(3003, function (err) {
    app.use(express.static(__dirname + '/'));
    if (err) {
        console.log(err.message)
    }
    //  var host = app.address().address
    //  var port = app.address().port

    logInfo("***** Server listening at port 3003", 1)
});


app.get('/', (request, response) => {
    logInfo("***** reloading page", 1)
    client.setAccount(defaultAccount)
    currentCurrency = defaultAccount.defaultCurrency.toLowerCase()
    currentCrypto = defaultAccount.defaultCrypto.toLowerCase()
    currentAccountKey = defaultAccountKey

    logInfo({ "current currency": currentCurrency }, 2)
    logInfo({ "current crypto": currentCrypto }, 2)

    response.sendFile(__dirname + '/html/bitstampGUI.html')
});


app.get('/cancelOrder', async (request, response) => {

    try {
        var t = request.url
        var urlString = "http://www.some.crap" + t
        var responseURL = new URL(urlString)
        var params = new URLSearchParams(responseURL.search);

        id = params.get("id")
        fee = parseFloat(params.get("fee"))
        newPrice = parseFloat(params.get("newPrice"))
        logInfo(`order ID to cancel\t${id}`, 1)
        logInfo(`new Price\t${newPrice}`, 1)
        logInfo(`fee\t${fee}`, 1)
        let resultCancel = await client.doCancelOrder(id)
        logInfo({ "result from cancel": resultCancel }, 2)

        if (resultCancel.type == 1) {
            resultCreate = await client.createLimitSellOrder(resultCancel.amount, newPrice.toFixed(4))
        } else {
            var balances = await client.getAccountBalance()
            amount = balances[currentCurrency]
            crypto_original = balances[currentCrypto]

            let currency_available = amount * (1 - fee) // deduct fee already
            let newAmount = currency_available / newPrice
            logInfo(`new amount\t${newAmount}`, 1)
            resultCreate = await client.createLimitBuyOrder(newAmount.toFixed(4), newPrice.toFixed(4))
        }
        logInfo({ "result from new order": resultCreate }, 2)
        response.json(resultCreate)


    } catch (e) {
        console.log(e)
    }

});

async function getLowestPrice(orderID) {
    var transactionFound = false
    var transactions = await client.getUserTransactions("limit=60")

    logInfo({ "last 10 transactions": transactions }, 3)

    var minPrice = 999999999999
    var order_id = ""
    for (transaction in transactions) {
        //console.log(result[order])

        //console.log(`Checking transactions: \t${transaction}`)
        t = transactions[transaction].order_id
        if (orderID == t) {
            transactionFound = true

            // console.log(`found sell transaction\t${order_id}`)
            price = transactions[transaction][`${currentCrypto}_${currentCurrency}`]
            //console.log(`Price\t${price}`)
            if (price < minPrice) {
                minPrice = price
            }

        }
    }
    if (minPrice == 999999999999) {
        minPrice = NaN
    }
    logInfo(`last minimum sell price\t${minPrice}`, 1)
    return minPrice

}

async function getLastSellPrice() {
    var transactionFound = false
    var transactions = await client.getUserTransactions("limit=40")
    lowestPrice = -1
    var order_id = ""
    for (transaction in transactions) {
        console.log(transactions[transaction])

        order_id = transactions[transaction].order_id
        xrp = parseFloat(transactions[transaction][`${currentCrypto}`])
        type = transactions[transaction].type
        if (type == '2' && xrp < 0) {
            transactionFound = true

            // console.log(`found sell transaction\t${order_id}`)
            lowestPrice = await getLowestPrice(order_id)
            break
        }
    }
    if (lowestPrice == -1) {
        lowestPrice = NaN
    }
    return { "sellPrice": lowestPrice }
}

async function getCurrentPrice() {
    var ticker = await client.getHourlyTicker()
    logInfo({ "current price, ticker": ticker }, 1)
    return { "currentPrice": ticker.last }
}

app.get('/sellNow', async (request, response) => {

    try {
        var balances = await client.getAccountBalance()
        var amount = balances[currentCrypto]

        // check if orders available

        orders = await client.getOpenOrders()
        if (orders.length > 0) {
            order = orders[0]
            logInfo({ "open order": order }, 2)

            // type 0 = buy, type 1 = sell

            if ("1" == order.type) {
                logInfo("need to cancel existing sell order", 1)
                // buy order which needs be cancelled
                await client.doCancelOrder(order.id)
            }

            var balances = await client.getAccountBalance()
            var amount = balances[currentCrypto]

            //{ crypto: '0.00000000', currency: '0.00' }
            if (0 < amount) {
                resultCreate = await client.createInstantSellOrder(amount)

                logInfo({ "instant sell result": resultCreate }, 1)

            } else {
                logInfo("nothing to sell available", 1)
            }

        } else {
            logInfo("no open order to cancel", 1)
            if (0 < amount) {
                resultCreate = await client.createInstantSellOrder(amount)

                logInfo({ "instant sell result": resultCreate }, 1)

            } else {
                logInfo("nothing to sell available", 1)
            }

        }

    } catch (e) {
        console.log(e)
    }

});

app.get('/buyNow', async (request, response) => {

    try {
        var balances = await client.getAccountBalance()
        var amount = balances[currentCurrency]

        // check if orders available
        orders = await client.getOpenOrders()
        if (orders.length > 0) {
            order = orders[0]
            logInfo("open order", 2)
            logInfo(order, 2)

            // type 0 = buy, type 1 = sell

            if ("0" == order.type) {
                logInfo("need to cancel existing buy order", 1)
                // buy order which needs be cancelled
                await client.doCancelOrder(order.id)
            }
            balances = await client.getAccountBalance()
            amount = balances[currentCurrency]

            if (0 < amount) {
                resultCreate = await client.createInstantBuyOrder(amount)

                logInfo({ "instant buy result": resultCreate }, 1)

            } else {
                logInfo("no money to buy available", 1)
            }

        } else {
            logInfo("no open order to cancel", 1)
            if (0 < amount) {
                resultCreate = await client.createInstantBuyOrder(amount)

                logInfo({ "instant buy result": resultCreate }, 1)
            } else {
                logInfo("no money to buy available", 1)
            }
        }

        // now create instant buy order


    } catch (e) {
        console.log(e)
    }

});

app.get('/getFee', async (request, response) => {

    try {

        var fee = await client.getFee()
        logInfo({ "current fee": fee }, 1)
        response.json(fee)


    } catch (e) {
        console.log(e)
    }

});


app.get('/getCurrency', async (request, response) => {

    try {
        logInfo({ "current currency": currentCurrency }, 1)
        response.json({ currency: currentCurrency.toUpperCase() })
    } catch (e) {
        console.log(e)
    }

});

app.get('/setCurrency', async (request, response) => {

    try {
        var t = request.url
        var urlString = "http://www.some.crap" + t
        var responseURL = new URL(urlString)
        var params = new URLSearchParams(responseURL.search);

        currentCurrency = params.get("currency").toLowerCase()
        logInfo({ "new currency": currentCurrency }, 1)
        client.setCurrency(currentCurrency)
        response.json({ result: "success" })
    } catch (e) {
        console.log(e)
    }

});

app.get('/getAccounts', async (request, response) => {

    try {
        logInfo({ "accounts": accounts }, 3)
        response.json({ accounts, defaultAccount: currentAccountKey })
    } catch (e) {
        console.log(e)
    }

});

app.get('/changeAccount', async (request, response) => {

    try {
        var t = request.url
        var urlString = "http://www.some.crap" + t
        var responseURL = new URL(urlString)
        var params = new URLSearchParams(responseURL.search);

        account = params.get("account")
        console.log("new account")
        console.log(account)
        response.json({ result: "success" })
        var newAccount = {}
        // fetch new account
        Object.keys(accounts).forEach(function (key, index) {

            console.log(key, accounts[key])
            if (key == account) {
                console.log("found", accounts[key].secret)
                newAccount = accounts[key]
                currentAccountKey = key
            }
            // key: the name of the object key
            // index: the ordinal position of the key within the object 
        });

        console.log("New account", newAccount)

        client.setAccount(newAccount)
        currentCurrency = newAccount.defaultCurrency.toLowerCase()
        currentCrypto = newAccount.defaultCrypto.toLowerCase()
        logInfo({ "current currency": currentCurrency }, 2)
        logInfo({ "current crypto": currentCrypto }, 2)

    } catch (e) {
        console.log(e)
    }

});


app.get('/getCrypto', async (request, response) => {

    try {
        logInfo({ "current crypto": currentCrypto }, 1)
        response.json({ crypto: currentCrypto.toUpperCase() })
    } catch (e) {
        console.log(e)
    }

});


app.get('/setCrypto', async (request, response) => {

    try {
        var t = request.url
        var urlString = "http://www.some.crap" + t
        var responseURL = new URL(urlString)
        var params = new URLSearchParams(responseURL.search);

        currentCrypto = params.get("crypto").toLowerCase()
        console.log("new crypto")
        console.log(currentCrypto)
        client.setCrypto(currentCrypto)
        response.json({ result: "success" })
    } catch (e) {
        console.log(e)
    }

});

app.get('/writeBotThresholds', async (request, response) => {

    try {
        var t = request.url
        var urlString = "http://www.some.crap" + t
        var responseURL = new URL(urlString)
        var params = new URLSearchParams(responseURL.search);

        high = params.get("high")
        logInfo(`new high\t${high}`, 1)
        low = params.get("low")
        logInfo(`new low\t${low}`, 1)

        // here we write a file
        fs.writeFile(configuration.path_bot_ini, 'high=' + high + "\rlow=" + low, function (err) {
            if (err) {
                console.log(err);
                response.json({ result: "failure" })
            }

            logInfo("new thresholds written for bot to pick up", 1);
            response.json({ result: "success" })

        });

    } catch (e) {
        console.log(e)

    }

});

app.get('/readBotThresholds', async (request, response) => {

    try {
        // here we write a file
        const data = fs.readFileSync(configuration.path_bot_ini, 'utf8')
        params = data.split("\r")
        logInfo({ "bot current high": params[0] }, 1)
        logInfo({ "bot current low": params[1] }, 1)

        thresholds = { high: params[0].split("=")[1], low: params[1].split("=")[1] }
        response.json(thresholds)


    } catch (e) {
        console.log(e)
        response.json({ result: "failure" })
    }

});

app.get('/getOpenOrder', async (request, response) => {

    try {
        // console.log(parts)
        let result = await client.getOpenOrders()
        if (result[0] === undefined) {
            logInfo("no open orders to return", 1)
            result = { "id": "", "buyPrice": "", type: "" }
            response.json(result)
        } else {
            logInfo({ "open order": result[0] }, 1)
            response.json(result[0])
        }


    } catch (e) {
        console.log(e)
    }

});

app.get('/getLastSellPrice', async (request, response) => {

    try {
        lastSellPrice = await getLastSellPrice()
        logInfo({ "last sell price": lastSellPrice }, 1)
        response.json(lastSellPrice)

    } catch (e) {
        console.log(e)
    }

});

app.get('/getCurrentPrice', async (request, response) => {

    try {
        currentPrice = await getCurrentPrice()
        logInfo({ "current price": currentPrice }, 1)
        response.json(currentPrice)

    } catch (e) {
        console.log(e)
    }

});

app.get('/getBalance', async (request, response) => {

    try {

        let result = await client.getAccountBalance(false)
        logInfo({ "account Balance": result }, 2)
        // console.log("currencCrypto", currentCrypto, "currentCurrency", currentCurrency)
        // convert universal
        var balances = {
            crypto_available: result[currentCrypto + '_available'], crypto_reserved: result[currentCrypto + '_reserved'],
            currency_available: result[currentCurrency + '_available'], currency_reserved: result[currentCurrency + '_reserved']
        }
        logInfo({ "returned to GUI": balances }, 2)
        response.json(balances)

    } catch (e) {
        console.log(e)
    }

});



async function logInfo(info, level) {
    // it not debugging, do not output to console
    if (configuration.debug) {
        if (level <= configuration.debugLevel) {
            console.log(info)
        }
    }
    // always output to file

    if ('object' == typeof (info)) {
        info = JSON.stringify(info)
    }
    // here we write a file
    fs.appendFileSync(configuration.path_log, info);
    fs.appendFileSync(configuration.path_log, "\r");
}

app.get('/getTransactions', async (request, response) => {

    try {
        var t = request.url
        var urlString = "http://www.some.crap" + t
        var responseURL = new URL(urlString)
        var params = new URLSearchParams(responseURL.search);

        const dateFrom = new Date(params.get("dateFrom"))
        logInfo({ "date from": dateFrom }, 1)

        txs = await getTransactions(dateFrom)
        response.json(txs)

    } catch (e) {
        console.log(e)
    }

});

async function getTransactions(dateFrom) {
    result = await client.getUserTransactions("limit=1000")
    // console.log(result)

    var d = new Date()
    const offset = d.getTimezoneOffset()

    var cryptoCode
    var currencyCode
    var pair
    var price
    var cryptoAmount
    var currencyAmount
    var fee
    var dtString
    var dt
    var txs = []
    for (var k in result) {
        for ([key, value] of Object.entries(result[k])) {
            var pos = key.indexOf("_")
            if (0 < pos && "order_id" != key) {
                // found pair
                if (key in pairs) {
                    // confirmed pair
                    cryptoCode = key.substring(0, pos)
                    currencyCode = key.substring(pos + 1, key.length)
                    // console.log(currencyCode, cryptoCode)
                    pair = key
                    break
                }

            }
        }
        price = result[k][pair]
        cryptoAmount = parseFloat(result[k][cryptoCode])
        currencyAmount = parseFloat(result[k][currencyCode])
        order_id = result[k]['order_id']
        id = result[k]['id']
        type = result[k]['type']
        fee = result[k]['fee']
        dtString = result[k]['datetime'].substring(0, 19)

        dtTemp = new Date(dtString)

        dt = new Date(dtTemp - (2 * 60000 * offset)) // 2* cause the Date() caused recalculation of offset, now we have to "go back twice the offset

        tx = { order_id: order_id, id: id, datetime: dt, fee: fee, price: price, a1: cryptoAmount, p1: cryptoCode, a2: currencyAmount, p2: currencyCode, }
        // console.log(tx)
        if (dt >= dateFrom && type == "2") {
            txs.push(tx)
        }
    }

    return txs

}


//...
app.get('/download', async (request, response) => {
    //...
    var t = request.url
    var urlString = "http://www.some.crap" + t
    var responseURL = new URL(urlString)
    var params = new URLSearchParams(responseURL.search);

    const dateFrom = new Date(params.get("dateFrom"))
    logInfo({ "date from": dateFrom }, 1)

    var txs = await getTransactions(dateFrom)
    var fileData = ""
    // header
    for (var k in txs[0]) {
        if (k == "a1" || k == "a2") {
            fileData += "Amount,"
        } else if (k == "p1" || k == "p2") {
            fileData += "Code,"
        } else {
            fileData += k + ","
        }
    }
    fileData = fileData.substring(0, fileData.length - 1)
    fileData += "\r"


    for (var i in txs) {

        for (var k in txs[i]) {
            if (k == "datetime") {
                fileData += '"' + txs[i][k].toISOString() + '",'
            } else if ("p1" == k || "p2" == k) {
                fileData += '"' + txs[i][k].toUpperCase() + '",'
            }
            else {
                fileData += '"' + txs[i][k] + '",'
            }

        }
        fileData = fileData.substring(0, fileData.length - 1)
        fileData += "\r"
    }

    var fileContents = Buffer.from(fileData);

    var readStream = new stream.PassThrough();
    readStream.end(fileContents);

    response.set('Content-disposition', 'attachment; filename=Transactions.csv');
    response.set('Content-Type', 'text/plain');

    readStream.pipe(response);
});