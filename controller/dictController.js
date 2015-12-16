"use strict";
var config = require('../config');
var _ = require('lodash');
var hospitalDAO = require('../dao/hospitalDAO');
var businessPeopleDAO = require('../dao/businessPeopleDAO');
module.exports = {
    getDepartments: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findDepartments(hospitalId).then(function (departments) {
            res.send({ret: 0, data: departments});
        });
        return next();
    },
    getDoctors: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findDoctors(hospitalId).then(function (doctors) {
            res.send({ret: 0, data: doctors});
        });
        return next();
    },

    getBusinessPeople: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        businessPeopleDAO.findBusinessPeople(hospitalId).then(function (result) {
            res.send({ret: 0, data: result});
        });
        return next();
    },

    getShiftPeriods: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        businessPeopleDAO.findShiftPeriods(hospitalId).then(function (result) {
            res.send({ret: 0, data: result});
        });
        return next();
    }
}