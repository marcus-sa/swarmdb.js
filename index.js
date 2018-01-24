var net = require('net');
// TODO: only import sub node module such as web3-eth-accounts for signing to make swarmdb.js lighter
// https://www.npmjs.com/package/web3-providers-http + https://www.npmjs.com/package/web3-eth-accounts
var Web3 = require('web3'); 

var PRIVATE_KEY = process.env.PRIVATE_KEY;
var PROVIDER = process.env.PROVIDER;

function SWARMDB(options) {
    var client = new net.Socket();
    var providerUrl = PROVIDER ? PROVIDER : "http://localhost:8545";
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl)); 
    
    this.signChallenge = false; 
    // store the requests in buffer
    this.buffer = [];
    this.waitForResponse = false;

    var that = this;

    this.client = client.connect(options.port, options.host, function() {  
        logExceptOnTest('CONNECTED TO: ' + options.host + ':' + options.port);
    });

    this.client.on('close', function() {
        logExceptOnTest('Server side connection closed');
    });

    this.client.on('error', function(err) {
        logExceptOnTest("Error: " + err);
    });
    
    this.promise = new Promise((resolve, reject) => {
        that.client.on('data', function(data) {
            // make sure verification succeeds before processing any request
            if (!that.signChallenge) {
                if (PRIVATE_KEY.length == 64) PRIVATE_KEY = "0x" + PRIVATE_KEY;
                var sig = that.web3.eth.accounts.sign(data.toString().replace(/\n|\r/g, ""), PRIVATE_KEY);
                logExceptOnTest("Sending signature: " + sig.signature.slice(2));
                that.signChallenge = true;
                that.verify = that.client.write(sig.signature.slice(2) + "\n", null, function() {
                    resolve();
                });   
            }
            // process the requests in the buffer in sequence
            that.waitForResponse = false;
            if (that.buffer.length) {
                var pair = that.buffer.shift();
                var handler = pair[0];
                process.nextTick(function() {
                    // TODO: parse error following the format of returned value
                    if (data.errorcode) {
                        handler("err", null);
                    }
                    else {
                        handler(null, data.toString().trim());
                    }    
                });
                that.flush();
            } 
        });
    });
};
SWARMDB.prototype = {
    // buffer the request
    request: function(msg, handler) {
        this.buffer.push([handler, msg]);
        this.flush();
    },
    // send request to server
    flush: function() {
        var pair = this.buffer[0];
        if (pair && !this.waitForResponse) {
            this.client.write(pair[1]);
            this.waitForResponse = true;
        }
    },
    createTable: function(table, columns, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "CreateTable",
            "table": table,
            "columns": columns
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    get: function(table, tableowner, key, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Get",
            "tableowner": tableowner,
            "table": table,
            "key": key,
            "columns": null
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    put: function(table, tableowner, rows, callback) {
        var that = this;
        var rowArr = [];
        for (var i = 0; i < rows.length; i++) {
            rowArr.push({"Cells": rows[i]});
        }
        var msg = JSON.stringify({
            "requesttype": "Put",
            "tableowner": tableowner,
            "table": table,
            "rows": rowArr,
            "columns": null
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    query: function(queryStatement, tableowner, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Query",
            "tableowner": tableowner,
            "RawQuery": queryStatement
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    }
};

// suppress logging in the test mode
function logExceptOnTest(string) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(string);
    }
}

exports.createConnection = function createConnection(options) {
    return new SWARMDB(options);
};