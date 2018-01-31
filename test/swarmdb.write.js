process.env.NODE_ENV = "test";

require("./swarmdb.createTable.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('write a row', function() {
    var dbname = "testdb21";
    var tablename = "contacts";
    var owner = "test21.eth";

    it('swarmdb.put', function (done) {
        swarmdb.put(dbname, tablename, owner, [ { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" } ], function (err, result) {
            assert(result === "ok");
            done();
        });
    });

    /*
    it('swarmdb.insert', function (done) {
        var query = "insert into contacts (email, age, name) values ('paul@gmail.com', 8, 'Paul')";
        swarmdb.query(query, dbname, owner, function (err, result) {
            assert(result === "ok");
            done();
        });
    });
    */
});