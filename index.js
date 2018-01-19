var net = require('net');
// TODO: only import sub node module such as web3-eth-accounts for signing to make swarmdb.js lighter
var Web3 = require('web3'); 

const PRIVATE_KEY = process.env.PRIVATE_KEY;

function SWARMDB(options) {
    var client = new net.Socket();
    // TODO: make users able to specify the Ethereum provider
    this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); 
    
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
                    if (data.err) {
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
    createTable: function(table, tableowner, columns, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "CreateTable",
            "tableowner": tableowner,
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
        var msg = JSON.stringify({
            "requesttype": "Put",
            "tableowner": tableowner,
            "table": table,
            "rows": rows,
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