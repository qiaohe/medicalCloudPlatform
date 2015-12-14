"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    insert: function (employee) {
        return db.query(sqlMapping.employee.insert, employee);
    },
    findByUsername: function (username) {
        return db.query(sqlMapping.employee.findByUserName, username);
    }
}