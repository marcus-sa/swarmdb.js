process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

const { DB_NAME, TABLE_NAME, OWNER } = require('./helper/constants');

describe('create a database', function() {
    it('swarmdb.createDatabase', function (done) {
        swarmdb.createDatabase(DB_NAME, OWNER, 1, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});