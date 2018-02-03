// TODO: rewrite everything in ES6
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
                if (!PRIVATE_KEY || (PRIVATE_KEY.length != 64 && PRIVATE_KEY.length != 66)) {
                    throw "Please set correct PRIVATE_KEY";
                }
                if (PRIVATE_KEY.length == 64) PRIVATE_KEY = "0x" + PRIVATE_KEY;
                var sig = that.web3.eth.accounts.sign(data.toString().replace(/\n|\r/g, ""), PRIVATE_KEY);
                // logExceptOnTest("Sending signature: " + sig.signature.slice(2));
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
                    var dataJSON;
                    if (parseJSON(data)) {
                        dataJSON = JSON.parse(data);
                        if (dataJSON.errorcode) {
                            handler(JSON.stringify(dataJSON), null);
                        }
                        else {
                            handler(null, data.toString().trim());
                        }
                    }
                    else {
                        handler(null, data.toString().trim());
                    }   
                });
                that.flush();
            } 
        });
    });
}

// TODO: return Promise instead of callback after rewriting in ES6
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
    createDatabase: function(database, owner, encrypted, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "CreateDatabase",
            "database": database,
            "owner": owner,
            "encrypted": encrypted
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    listDatabases: function(owner, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "ListDatabases",
            "owner": owner
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },    
    createTable: function(database, table, owner, columns, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "CreateTable",
            "database": database,
            "table": table,
            "owner": owner,
            "columns": columns
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    get: function(database, table, owner, key, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Get",
            "database": database,
            "table": table,
            "owner": owner,
            "key": key,
            "columns": null
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    put: function(database, table, owner, rows, callback) {
        // if (! (rows instanceof Array)) {
        //     throw "rows field in Put method is NOT a VALID array";
        // }
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Put",
            "database": database,
            "table": table,
            "owner": owner,
            "rows": rows,
            "columns": null
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    query: function(queryStatement, database, owner, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Query",
            "database": database,
            "owner": owner,
            "Query": queryStatement
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

// check if a string is valid JSON string
function parseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return true;
        }
    }
    catch (e) { }

    return false;
}

exports.createConnection = function createConnection(options) {
    return new SWARMDB(options);
};