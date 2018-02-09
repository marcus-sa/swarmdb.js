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
            assert(result.data[0].ColumnName === "email");
            assert(result.data[0].ColumnType === "STRING");
            assert(result.data[0].IndexType  === "BPLUS");
            assert(result.data[0].Primary    === 1);

            assert(result.data[1].ColumnName === "name");
            assert(result.data[1].ColumnType === "STRING");
            assert(result.data[1].IndexType  === "HASH");
            assert(result.data[1].Primary    === 0);

            assert(result.data[2].ColumnName === "age");
            assert(result.data[2].ColumnType === "INTEGER");
            assert(result.data[2].IndexType  === "BPLUS");
            assert(result.data[2].Primary    === 0);

            done();
        });
    });
});