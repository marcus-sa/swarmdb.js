// TODO: rewrite everything in ES6
var net = require('net');
// TODO: only import sub node module such as web3-eth-accounts for signing to make swarmdb.js lighter
// https://www.npmjs.com/package/web3-providers-http + https://www.npmjs.com/package/web3-eth-accounts
var Web3 = require('web3'); 

var PRIVATE_KEY = process.env.PRIVATE_KEY;
var PROVIDER = process.env.PROVIDER;

var CURRENT_SWARMDBJS_VERSION = "0.0.5-alpha.3";

function SWARMDB(options) {
    var client = new net.Socket();
    var providerUrl = PROVIDER ? PROVIDER : "http://localhost:8545";
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl)); 
    
    this.signChallenge = false; 
    // store the requests in buffer
    this.buffer = [];
    this.waitForResponse = false;

    // store owner and currently active database, table
    this.owner = null;
    this.database = null;
    this.table = null;

    var that = this;

    this.client = client.connect(options.port, options.host, function() {
        logExceptOnTest('CURRENT SWARMDBJS VERSION: ' + CURRENT_SWARMDBJS_VERSION);
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

                var challengePair = JSON.parse(data.toString().replace(/\n|\r/g, ""));
                var challenge = challengePair.challenge;
                var serverVersion = challengePair.serverversion;
                logExceptOnTest("CURRENT SERVER VERSION: " + serverVersion);
                
                var sig = that.web3.eth.accounts.sign(challenge, PRIVATE_KEY);
                // logExceptOnTest("Sending signature: " + sig.signature.slice(2));
                var challengeResponse = { response: sig.signature.slice(2), clientversion: CURRENT_SWARMDBJS_VERSION, clientname: "swarmdb.js"  };
                that.signChallenge = true;
                that.verify = that.client.write(JSON.stringify(challengeResponse) + "\n", null, function() {
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
    createDatabase: function(owner, database, encrypted, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "CreateDatabase",
            "owner": owner,
            "database": database,
            "encrypted": encrypted
        }) + "\n";
        that.owner = owner;
        that.database = database;
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    listDatabases: function(callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "ListDatabases",
            "owner": that.owner
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    }, 
    openDatabase: function(owner, database) {
        this.owner = owner;
        this.database = database;
    },   
    createTable: function(table, columns, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "CreateTable",
            "owner": that.owner,
            "database": that.database,
            "table": table,
            "columns": columns
        }) + "\n";
        that.table = table;
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    describeTable: function(table, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "DescribeTable",
            "owner": that.owner,
            "database": that.database,
            "table": table
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    listTables: function(callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "ListTables",
            "database": that.database,
            "owner": that.owner
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    openTable: function(table) {
        this.table = table;
    },
    get: function(key, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Get",
            "owner": that.owner,
            "database": that.database,
            "table": that.table,
            "key": key,
            "columns": null
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    put: function(rows, callback) {
        // if (! (rows instanceof Array)) {
        //     throw "rows field in Put method is NOT a VALID array";
        // }
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Put",
            "owner": that.owner,
            "database": that.database,
            "table": that.table,
            "rows": rows,
            "columns": null
        }) + "\n";
        this.promise.then(() => {
            that.request(msg, callback);
        });
    },
    query: function(queryStatement, callback) {
        var that = this;
        var msg = JSON.stringify({
            "requesttype": "Query",
            "owner": that.owner,
            "database": that.database,
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