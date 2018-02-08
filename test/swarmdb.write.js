process.env.NODE_ENV = "test";

require("./swarmdb.listTables.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('write a row', function() {

    it('swarmdb.put', function (done) {
        swarmdb.put([ { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" } ], function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });

    it('swarmdb.insert', function (done) {
        var query = "insert into contacts (email, age, name) values ('paul@gmail.com', 8, 'Paul')";
        swarmdb.query(query, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});