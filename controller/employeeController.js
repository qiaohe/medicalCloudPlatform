"use strict";
var config = require('../config');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var redis = require('../common/redisClient');
var _ = require('lodash');
var i18n = require('../i18n/localeMessage');
var employeeDAO = require('../dao/employeeDAO');
var md5 = require('md5');
module.exports = {
    addEmployee: function (req, res, next) {
        var employee = req.body;
        employee.password = md5(employee.password);
        employeeDAO.insert(employee).then(function (result) {
            employee.id = result.insertId;
            res.send({ret: 0, data: employee});
        })
    }
}