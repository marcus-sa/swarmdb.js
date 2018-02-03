process.env.NODE_ENV = "test";

require("./swarmdb.createTable.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

const { DB_NAME, TABLE_NAME, OWNER } = require('./helper/constants');

describe('write a row', function() {

    it('swarmdb.put', function (done) {
        swarmdb.put(DB_NAME, TABLE_NAME, OWNER, [ { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" } ], function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });

    it('swarmdb.insert', function (done) {
        var query = "insert into contacts (email, age, name) values ('paul@gmail.com', 8, 'Paul')";
        swarmdb.query(query, DB_NAME, OWNER, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});