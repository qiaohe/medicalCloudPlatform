"use strict";
var config = require('../config');
var redis = require('../common/redisClient');
var i18n = require('../i18n/localeMessage');
var hospitalDAO = require('../dao/hospitalDAO');
var _ = require('lodash');
var moment = require('moment');
module.exports = {
    getDepartments: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findDepartmentsBy(hospitalId).then(function (departments) {
            return res.send({ret: 0, data: departments});
        });
        return next();
    },
    addDepartment: function (req, res, next) {
        var department = req.body;
        department.hospitalId = req.user.hospitalId;
        department.createDate = new Date();
        hospitalDAO.addDepartment(department).then(function (result) {
            department.id = result.insertId;
            res.send({ret: 0, data: department});
        });
        return next();
    },
    removeDepartment: function (req, res, next) {
        hospitalDAO.removeDepartment(req.params.id).then(function (result) {
            res.send({ret: 0, message: i18n.get('department.remove.success')});
        });
        return next();
    },
    updateDepartment: function (req, res, next) {
        var department = req.body;
        department.hospitalId = req.user.hospitalId;
        hospitalDAO.updateDepartment(department).then(function (result) {
            res.send({ret: 0, message: i18n.get('department.update.success')});
        });
        return next();
    },
    getDoctorsByDepartment: function (req, res, next) {
        var departmentId = req.params.departmentId;
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findDoctorsByDepartment(hospitalId, departmentId).then(function (doctors) {
            return res.send({ret: 0, data: doctors});
        });
        return next();
    },

    getShitPlan: function (req, res, next) {
        var doctorId = req.params.doctorId;
        var start = req.query.d;
        hospitalDAO.findShiftPlans(doctorId, start).then(function (plans) {
            var data = _.groupBy(plans, function (plan) {
                moment.locale('zh_CN');
                return moment(plan.day).format('YYYY-MM-DD dddd');
            });
            var result = [];
            for (var key in data) {
                var item = {
                    day: key, actualQuantity: _.sum(data[key], function (item) {
                        return item.actualQuantity;
                    }), plannedQuantity: _.sum(data[key], function (item) {
                        return item.plannedQuantity;
                    }), periods: data[key]
                };
                item.periods.forEach(function (object) {
                    delete object.day;
                })
                result.push(item);
            }
            res.send({ret: 0, data: result});
        });
        return next();
    },
    getDoctorById: function (req, res, next) {
        hospitalDAO.findDoctorById(req.params.doctorId).then(function (doctors) {
            var doctor = doctors[0];
            return res.send({ret: 0, data: doctor});
        });
        return next();
    },
    updateHospital: function (req, res, next) {
        var hospital = req.body;
        hospital.id = req.user.hospitalId;
        hospital.images = hospital.images && hospital.images.length && hospital.images.join(',');
        hospitalDAO.updateHospital(hospital).then(function (result) {
            res.send({ret: 0, message: i18n.get('hospital.update.success')});
        });
        return next();
    },

    getHospital: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findHospitalById(hospitalId).then(function (result) {
            result[0].images = result[0].images && result[0].images.split(',');
            res.send({ret: 0, data: result[0]});
        });
        return next();
    }
}