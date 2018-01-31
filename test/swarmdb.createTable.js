process.env.NODE_ENV = "test";

require("./swarmdb.createDatabase.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('create a table', function() {
    var dbname = "testdb21";
    var owner = "test21.eth";

    it('swarmdb.createTable', function (done) {
        var tablename = "contacts";
        var columns = [
            { "indextype": 1, "columnname": "email", "columntype": 2, "primary": 1 },
            { "indextype": 1, "columnname": "name", "columntype": 2, "primary": 0 },
            { "indextype": 2, "columnname": "age", "columntype": 1, "primary": 0 }
        ];
        swarmdb.createTable(dbname, tablename, owner, columns, function (err, result) {
            assert(result === "ok");
            done();
        });
    });
});