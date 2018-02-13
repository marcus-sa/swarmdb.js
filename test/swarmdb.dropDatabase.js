process.env.NODE_ENV = "test";

require("./swarmdb.dropTable.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

const { OWNER, DB_NAME } = require('./helper/constants');

describe('drop a database', function() {
    it('swarmdb.dropDatabase', function (done) {
        swarmdb.dropDatabase(OWNER, DB_NAME, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});