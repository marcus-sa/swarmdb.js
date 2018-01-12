process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('create a table', function() {
    it('swarmdb.createTable', function (done) {
        var tablename = "contacts";
        var tableowner = "0x1234567890123456789012345678901234567890";
        var columns = [
            { "indextype": 1, "columnname": "email", "columntype": 2, "primary": 1 },
            { "indextype": 1, "columnname": "name", "columntype": 2, "primary": 0 },
            { "indextype": 2, "columnname": "age", "columntype": 1, "primary": 0 }
        ];
        swarmdb.createTable(tablename, tableowner, columns, function (err, result) {
            assert(result === "ok");
            done();
        });
    });
});