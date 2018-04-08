'use strict';
 
const net = require('net');
const Web3EthAccounts = require('web3-eth-accounts');

let PRIVATE_KEY = process.env.PRIVATE_KEY;

class SWARMDB {
    constructor(address, port) {
        this.socket = new net.Socket();
        this.address = address;
        this.port = port;

        this.init();
    }
 
    init() {
        this.socket.connect(this.port, this.address, () => {
            console.log(`Connected to: ${this.address} :  ${this.port}`);
        });

        this.socket.on('close', () => {
            console.log('Connection closed');
        });
    }  

    createConnection() {
        let that = this;
        let flag = false;
        let account = new Web3EthAccounts("http://localhost:8545");

        if (!PRIVATE_KEY) {
            throw "PRIVATE_KEY is empty! Please set PRIVATE_KEY in terminal";
        }
        if (PRIVATE_KEY.length != 64 && PRIVATE_KEY.length != 66) {
            throw "PRIVATE_KEY length is NOT Valid! Please set correct PRIVATE_KEY";
        }
        
        if (PRIVATE_KEY.length == 64) PRIVATE_KEY = "0x" + PRIVATE_KEY;


        return new Promise((resolve, reject) => {
            that.socket.once('data', (data) => {
                if (!flag) {
                    flag = true;
                    let challengePair = JSON.parse(data.toString().replace(/\n|\r/g, ""));
                    let challenge = challengePair.challenge;
                    
                    
                    let sig = account.sign(challenge, PRIVATE_KEY);
    
                    let challengeResponse = { response: sig.signature.slice(2), clientversion: "0.1.0", clientname: "swarmdb.js"  };
                    // console.log(challengeResponse);
                    that.socket.write(JSON.stringify(challengeResponse) + "\n");
                    
                    resolve();
                }


            });
 
            that.socket.on('error', (err) => {
                reject(err);
            });
 
        });        
    }
 
    sendMessage(message) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.socket.write(message);
 
            that.socket.once('data', (data) => {
                if (that.parseJSON(data)) {
                    let dataJSON = JSON.parse(data);
                    if (dataJSON.errorcode) {
                        reject(dataJSON);
                    }
                    else {
                        resolve(data.toString().trim());
                    }
                }
                else {
                    resolve(data.toString().trim());
                }
            });
 
            that.socket.on('error', (err) => {
                reject(err);
            });
 
        });
    }

    createDatabase(owner, database, encrypted) {
        let msg = JSON.stringify({
            "requesttype": "CreateDatabase",
            "owner": owner,
            "database": database,
            "encrypted": encrypted
        }) + "\n";
        return this.sendMessage(msg);
    }

    listDatabases(owner) {
        let msg = JSON.stringify({
            "requesttype": "ListDatabases",
            "owner": owner
        }) + "\n";
        return this.sendMessage(msg);
    }

    dropDatabase(owner, database) {
        let msg = JSON.stringify({
            "requesttype": "DropDatabase",
            "owner": owner,
            "database": database
        }) + "\n";
        return this.sendMessage(msg);
    }

    createTable(owner, database, table, columns) {
        let msg = JSON.stringify({
            "requesttype": "CreateTable",
            "owner": owner,
            "database": database,
            "table": table,
            "columns": columns
        }) + "\n";
        return this.sendMessage(msg);
    }

    describeTable(owner, database, table) {
        let msg = JSON.stringify({
            "requesttype": "DescribeTable",
            "owner": owner,
            "database": database,
            "table": table
        }) + "\n";
        return this.sendMessage(msg);
    }

    listTables(owner, database) {
        let msg = JSON.stringify({
            "requesttype": "ListTables",
            "owner": owner,
            "database": database
        }) + "\n";
        return this.sendMessage(msg);   
    }

    dropTable(owner, database, table) {
        let msg = JSON.stringify({
            "requesttype": "DropTable",
            "owner": owner,
            "database": database,
            "table": table
        }) + "\n";
        return this.sendMessage(msg);
    }

    get(owner, database, table, key) {
        let msg = JSON.stringify({
            "requesttype": "Get",
            "owner": owner,
            "database": database,
            "table": table,
            "key": key,
            "columns": null
        }) + "\n";
        return this.sendMessage(msg);
    }

    put(owner, database, table, rows) {
        let msg = JSON.stringify({
            "requesttype": "Put",
            "owner": owner,
            "database": database,
            "table": table,
            "rows": rows,
            "columns": null
        }) + "\n";
        return this.sendMessage(msg);
    }

    query(owner, database, queryStatement) {
        let msg = JSON.stringify({
            "requesttype": "Query",
            "owner": owner,
            "database": database,
            "Query": queryStatement
        }) + "\n";
        return this.sendMessage(msg);
    }

    parseJSON (jsonString) {
        try {
            let o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return true;
            }
        }
        catch (e) { }
    
        return false;
    }
}
module.exports = SWARMDB;