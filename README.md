# SWARMDB JavaScript API

[![Join the chat at https://gitter.im/wolkdb/swarmdb.js](https://badges.gitter.im/wolkdb/swarmdb.js.svg)](https://gitter.im/wolkdb/swarmdb.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is a client library for the SWARMDB API, implemented in JavaScript. It's available on npm as a node module.

To use swarmdb.js, you MUST install our SWARMDB Docker image and set up the SWARMDB node first. Instructions can be found [HERE](https://github.com/wolkdb/swarm.wolk.com).

*Please note* that the library is still under heavy development and it might not be stable.

## Install
```bash
> npm install swarmdb.js

## Configure
Upon installation and startup of your SWARMDB node, a default user and associated private key are generated and stored in the [SWARMDB configuration file](https://github.com/wolkdb/swarm.wolk.com/wiki/9.-SWARMDB-Server-Configuration,--Authentication-and-Voting#configuration-file). 

Set the private key as an environment variable.
This private key is associated with the user configured on the SWARMDB node.
```bash
> export PRIVATE_KEY=PRIVATE_KEY_IN_YOUR_CONFIG_FILE
```
<!--
(Optional) You can also specify an Ethereum provider instead of using the default http://localhost:8545
```bash
> export PROVIDER=YOUR_PROVIDER_LINK
```
-->

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

## Create database
Create a database by specifying owner, database name and encrypted status.

Owner should be a valid ENS domain.  
For encrypted status, 1 means true and 0 means false.

> `swarmdb.createDatabase(owner, databaseName, encrypted, callback)`
```javascript
swarmdb.createDatabase("test.eth", "testdb", 1, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Open database
Open a database by specifying owner and database name.
> `swarmdb.openDatabase(owner, databaseName)`
```javascript
swarmdb.openDatabase("test.eth", "testdb");
```

## List databases
List existing databases.

> `swarmdb.listDatabases(callback)`
```javascript
swarmdb.listDatabases(function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Drop database
Drop a database by specifying owner and database name.

> `swarmdb.dropDatabase(owner, databaseName, callback)`
```javascript
swarmdb.dropDatabase("test.eth", "testdb", function (err, result) {
    if (err) {
        throw err;
    }
    console.log(result);
});
```

## Create table
Create a table by specifying table name and column details.  

Columns consist of the following parameters:
* **indextype**: enter the desired indextype, defined [HERE](https://github.com/wolkdb/swarm.wolk.com/wiki/8.-SWARMDB-Types#table-index-types)
* **columnname**: enter the desired column name (no spaces allowed)
* **columntype**: enter the desired columntype, defined [HERE](https://github.com/wolkdb/swarm.wolk.com/wiki/8.-SWARMDB-Types#table-column-types)
* **primary**: enter 1 if the column is the primary key and 0 for any other column.

> `swarmdb.createTable(tableName, columns, callback)`
```javascript
var columns = [
    { "indextype": "BPLUS", "columnname": "email", "columntype": "STRING",  "primary": 1 },
    { "indextype": "HASH",  "columnname": "name",  "columntype": "STRING",  "primary": 0 },
    { "indextype": "BPLUS", "columnname": "age",   "columntype": "INTEGER", "primary": 0 }
];
swarmdb.createTable("contacts", columns, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Open table
Open a table by specifying table name.
> `swarmdb.openTable(tableName)`
```javascript
swarmdb.openTable("contacts");
```

## Describe table
Describe a table by specifying table name.
> `swarmdb.describeTable(tableName, callback)`
```javascript
swarmdb.describeTable("contacts", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Drop table
Drop a table by specifying table name.
> `swarmdb.dropTable(tableName, callback)`
```javascript
swarmdb.dropTable("contacts", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## List tables
List existing tables.

> `swarmdb.listTables(callback)`
```javascript
swarmdb.listTables(function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Read / Get / Select
Read a row (or rows) may be done via a Get call or a SQL Select query.

### Get
Get calls allow for the retrieval of a single row by specifying the value of a row's primary key.

> `swarmdb.get(key, callback)`
```javascript
swarmdb.get("bertie@gmail.com", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```
### Select
Select Query calls allow for the retrieval of rows by specifying a SELECT query using standard SQL. The [supported query operands](https://github.com/wolkdb/swarm.wolk.com/wiki/8.-SWARMDB-Types#supported-query-operands) are allowed to be used on both primary and secondary keys.

> `swarmdb.query(sqlQuery, callback)`
```javascript
swarmdb.query("SELECT email, name, age FROM contacts WHERE email = 'bertie@gmail.com'", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});

swarmdb.query("SELECT email, name, age FROM contacts WHERE age >= 5", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Write / Put / Insert / Update
Writing a row (or rows) may be done via a Put call or a SQL Insert query.

### Put
Put calls allow for writing rows.

Note: The "rows" input consists of an array of rows, where a row is a defined as a JSON object containing column/value pairs.  Each row must at least include a column/value pair for the primary key.

> `swarmdb.put(rows, callback)`
```javascript
swarmdb.put( [ { "email": "bertie@gmail.com", "name": "Bertie Basset", "age": 7 }, { "email": "paul@gmail.com", "name": "Paul", "age": 25 } ],  function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```
### Insert
Insert Query calls allow for the insertion of rows by specifying an INSERT query using standard SQL. SWARMDB currently only supports one row insert per call.

> `swarmdb.query(sqlQuery, callback)`
```javascript
swarmdb.query("INSERT INTO contacts (email, name, age) VALUES ('bertie@gmail.com', 'Bertie Basset', 7);", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

### Update
Update Query calls allow for the update on non-primary key using standard SQL.
> `swarmdb.query(sqlQuery, callback)`
```javascript
swarmdb.query("UPDATE contacts SET age=8 WHERE email='bertie@gmail.com';", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Try out the example
Find the script inside example folder and run it in your Node.js project folder.
```bash
> npm install swarmdb.js
> node apitest.js
```

## Run tests for developement
Make sure the private key is configured before running the tests
```bash
> git clone https://github.com/wolkdb/swarmdb.js.git
> cd swarmdb.js && npm install
> npm test
```

## Feedback / Question
Email us at [services@wolk.com](mailto:services@wolk.com)