"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    insert: function (notification) {
        return db.query(sqlMapping.notification.insert, notification);
    },
    findAll: function(page){
        return db.queryWithCount(sqlMapping.notification.findAll,[page.from, page.size]);
    }
}