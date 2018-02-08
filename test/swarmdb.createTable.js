process.env.NODE_ENV = "test";

require("./swarmdb.listDatabases.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

const { TABLE_NAME } = require('./helper/constants');

describe('create a table', function() {
    it('swarmdb.createTable', function (done) {
        var columns = [
            { "indextype": 1, "columnname": "email", "columntype": 2, "primary": 1 },
            { "indextype": 1, "columnname": "name", "columntype": 2, "primary": 0 },
            { "indextype": 2, "columnname": "age", "columntype": 1, "primary": 0 }
        ];
        swarmdb.createTable(TABLE_NAME, columns, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});