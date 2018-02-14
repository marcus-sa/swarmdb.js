process.env.NODE_ENV = "test";

require("./swarmdb.listTables.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

const { TABLE_NAME } = require('./helper/constants');

describe('describe a table', function() {
    it('swarmdb.describeTable', function (done) {
        swarmdb.describeTable(TABLE_NAME, function (err, result) {
            // result: {"data":[{"ColumnName":"email","ColumnType":"STRING","IndexType":"BPLUS","Primary":1},{"ColumnName":"name","ColumnType":"STRING","IndexType":"HASH","Primary":0},{"ColumnName":"age","ColumnType":"INTEGER","IndexType":"BPLUS","Primary":0}]}
            result = JSON.parse(result);
            assert(result.data.length === 3);

            done();
        });
    });
});