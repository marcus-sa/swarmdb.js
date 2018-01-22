process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('create a table', function() {
    it('swarmdb.createTable', function (done) {
        var tablename = "contacts";
        var columns = [
            { "indextype": 1, "columnname": "email", "columntype": 2, "primary": 1 },
            { "indextype": 1, "columnname": "name", "columntype": 2, "primary": 0 },
            { "indextype": 2, "columnname": "age", "columntype": 1, "primary": 0 }
        ];
        swarmdb.createTable(tablename, columns, function (err, result) {
            assert(result === "ok");
            done();
        });
    });
});