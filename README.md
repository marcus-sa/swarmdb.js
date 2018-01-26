# SWARMDB JavaScript API

[![Join the chat at https://gitter.im/wolktoken/swarmdb.js](https://badges.gitter.im/wolktoken/swarmdb.js.svg)](https://gitter.im/wolktoken/swarmdb.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is a client library for the SWARMDB API, implemented in JavaScript. It's available on npm as a node module.

To use swarmdb.js, you MUST install our SWARMDB Docker image and set up the SWARMDB node first. Instructions can be found [HERE](https://github.com/wolktoken/swarm.wolk.com).

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
> export PRIVATE_KEY=PRIVATE_KEY_IN_YOUR_CONFIG_FILE
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

Columns consist of the following parameters.
* **indextype**: enter the integer value corresponding with the desired indextype ([more details](https://github.com/wolktoken/swarm.wolk.com/wiki/8.-SWARMDB-Types#table-column-types))
* **columnname**: enter the desired column name (no spaces allowed)
* **columntype**: enter the integer value corresponding with the desired columntype ([more details](https://github.com/wolktoken/swarm.wolk.com/wiki/8.-SWARMDB-Types#table-index-types))
* **primary**: enter 1 if the column is the primary key and 0 for any other column.

> `swarmdb.createTable(table, columns, callback)`
```javascript
var columns = [
    { "indextype": 2, "columnname": "email", "columntype": 2, "primary": 1 },
    { "indextype": 2, "columnname": "name", "columntype": 2, "primary": 0 },
    { "indextype": 2, "columnname": "age", "columntype": 1, "primary": 0 }
];
swarmdb.createTable("contacts", columns, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Read / Get / Select
Read a row (or rows) may be done via a Get call or a SQL Select query.
Table owner, which is an Ethereum address without "0x", is required to read a row.

### Get
Get calls allow for the retrieval of a single row by specifying the value of a row's primary key.

> `swarmdb.get(table, tableowner, key, callback)`
```javascript
var tableowner = "ADDRESS_IN_YOUR_CONFIG_FILE";
swarmdb.get("contacts", tableowner, "bertie@gmail.com", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```
### Select
Select Query calls allow for the retrieval of rows by specifying a SELECT query using standard SQL. The [supported query operands](https://github.com/wolktoken/swarm.wolk.com/wiki/8.-SWARMDB-Types#supported-query-operands) are allowed to be used on both primary and secondary keys.

> `swarmdb.query(sqlQuery, tableowner, callback)`
```javascript
var tableowner = "ADDRESS_IN_YOUR_CONFIG_FILE";
swarmdb.query("SELECT email, name, age FROM contacts WHERE email = 'bertie@gmail.com'", tableowner, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});

swarmdb.query("SELECT email, name, age FROM contacts WHERE age >= 5", tableowner, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Write / Put / Insert
Writing a row (or rows) may be done via a Put call or a SQL Insert query.
Table owner, which is an Ethereum address without "0x", is required to read a row.

### Put
Put calls allow for writing rows.

Note: The "rows" input consists of an array of rows, where a row is a defined as a JSON object containing column/value pairs.  Each row must at least include a column/value pair for the primary key.

> `swarmdb.put(table, tableowner, rows, callback)`
```javascript
var tableowner = "ADDRESS_IN_YOUR_CONFIG_FILE";
swarmdb.put("contacts", tableowner, [ { "email": "bertie@gmail.com", "name": "Bertie Basset", "age": 7 }, { "email": "paul@gmail.com", "name": "Paul", "age": 25 } ],  function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```
### Insert
Insert Query calls allow for the insertion of rows by specifying an INSERT query using standard SQL. SWARMDB currently only supports one row insert per call.

> `swarmdb.query(sqlQuery, tableowner, callback)`
```javascript
var tableowner = "ADDRESS_IN_YOUR_CONFIG_FILE";
swarmdb.query("INSERT INTO contacts (email, name, age) VALUES ('bertie@gmail.com', 'Bertie Basset', 7);", tableowner, function (err, result) {
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