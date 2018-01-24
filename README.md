# SWARMDB JavaScript API

[![Join the chat at https://gitter.im/wolktoken/swarmdb.js](https://badges.gitter.im/wolktoken/swarmdb.js.svg)](https://gitter.im/wolktoken/swarmdb.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is a client library for the SWARMDB API, implemented in JavaScript. It's available on npm as a node module.

You need to run a [SWARMDB node](https://github.com/wolktoken/swarm.wolk.com) (which will be released soon) with local Ethereum environment to use this library.

*Please note* that the library is still under heavy development and it might not be stable.

## Install
```bash
> npm install swarmdb.js
```
Note that since web3 module has some [issues](https://github.com/ethereum/web3.js/issues/966) to be installed at a latest version, you need to install it manually right now.
```bash
> npm install web3@1.0.0-beta.26
```

## Configure
Upon installation and startup of your SWARMDB node, a default user and associated private key are generated and stored in the [SWARMDB configuration file](https://github.com/wolktoken/swarm.wolk.com/wiki/9.-SWARMDB-Server-Configuration,--Authentication-and-Voting#configuration-file). 

Set the private key as an environment variable.
This private key is associated with the user configured on the SWARMDB node.
```bash
> export PRIVATE_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```
(Optional) You can also specify an Ethereum provider instead of using the default http://localhost:8545
```bash
> export PROVIDER=YOUR_PROVIDER_LINK
```

## Import module
```javascript
var swarmdbAPI = require("swarmdb.js");
```

## Open connection
Open a connection by specifying configuration options like host and port
> `swarmdbAPI.createConnection(options)`
```javascript
var swarmdb = swarmdbAPI.createConnection({
    host: SWARMDB_HOST, //e.g. "localhost"
    port: SWARMDB_PORT  //e.g. 2001
});
```

## Create table
Create a table by specifying table name and column details.  
Table owner is not required in createTable method. It will fetch the Ethereum address associated with the user configured on the SWARMDB node and save it as tableowner in the table schema.
> `swarmdb.createTable(table, columns, callback)`
```javascript
var columns = [
    { "indextype": 2, "columnname": "email", "columntype": 2, "primary": 1 },
    { "indextype": 2, "columnname": "name", "columntype": 2, "primary": 0 },
    { "indextype": 1, "columnname": "age", "columntype": 1, "primary": 0 }
];
swarmdb.createTable("contacts", columns, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Read / Get / Select
Read a row from SWARMDB  
Table owner, which is an Ethereum address without "0x", is required to read a row.
> `swarmdb.get(table, tableowner, key, callback)`
```javascript
var tableowner = "1234567890123456789012345678901234567890";
swarmdb.get("contacts", tableowner, "bertie@gmail.com", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

> `swarmdb.query(sqlQuery, tableowner, callback)`
```javascript
var tableowner = "1234567890123456789012345678901234567890";
swarmdb.query("SELECT email, name, age FROM contacts WHERE email = 'bertie@gmail.com'", tableowner, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Write / Put
Write a row to SWARMDB  
Table owner, which is an Ethereum address without "0x", is required to read a row.
> `swarmdb.put(table, tableowner, row, callback)`
```javascript
var tableowner = "1234567890123456789012345678901234567890";
swarmdb.put("contacts", tableowner, [ { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" } ],  function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Run tests for developement
Make sure the private key is configured before running the tests
```bash
> git clone https://github.com/wolktoken/swarmdb.js.git
> cd swarmdb.js && npm test
```

## Feedback / Question
Email us at [support@wolk.com](mailto:support@wolk.com)