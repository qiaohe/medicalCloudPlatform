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
        employee.hospitalId = req.user.hospitalId;
        employee.status = 0;
        employeeDAO.insert(employee).then(function (result) {
            employee.id = result.insertId;
            res.send({ret: 0, data: employee});
        })
    },
    changePassword: function (req, res, next) {
        var employee = req.body;
        employee.password = md5(employee.password);
        employeeDAO.updateEmployee(employee).then(function (result) {
            res.send({ret: 0, message: i18n.get('employee.changePassword.success')});
        });
        return next();
    },

    deleteEmployee: function (req, res, next) {
        employeeDAO.updateEmployee({id: req.params.id, status: 2}).then(function (result) {
            res.send({ret: 0, message: i18n.get('employee.remove.success')});
        });
        return next();
    },

    updateEmployee: function (req, res, next) {
        var employee = req.body;
        employee.hospitalId = req.user.hospitalId;
        employeeDAO.updateEmployee(employee).then(function (result) {
            res.send({ret: 0, message: i18n.get('employee.update.success')});
        });
        return next();
    },

    getEmployees: function (req, res, next) {
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        employeeDAO.findEmployees(req.user.hospitalId, {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (empoyees) {
            if (!empoyees.rows.length) return res.send({ret: 0, data: []});
            empoyees.pageIndex = pageIndex;
            res.send({ret: 0, data: empoyees});
        });
        return next();
    },
    getDoctors: function (req, res, next) {
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        var hospitalId = req.user.hospitalId;
        employeeDAO.findDoctorsByHospital(hospitalId, {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (doctors) {
            if (!doctors.rows.length) return res.send({ret: 0, data: doctors});
            doctors.rows && doctors.rows.forEach(function (doctor) {
                doctor.gender = config.gender[doctor.gender];
                doctor.images = doctor.images && doctor.images.split(',');
            });
            doctors.pageIndex = pageIndex;
            res.send({ret: 0, data: doctors});
        });
        return next();
    },

    deleteDoctor: function (req, res, next) {
        employeeDAO.deleteDoctor(req.params.id).then(function (result) {
            res.send({ret: 0, message: i18n.get('doctor.delete.success')});
        });
        return next();
    },

    updateDoctor: function (req, res, next) {
        var doctor = req.body;
        doctor.hospitalId = req.user.hospitalId;
        doctor.updateDate = new Date();
        doctor.images = doctor.images && doctor.images.join(',');
        employeeDAO.updateDoctor(doctor).then(function (result) {
            res.send({ret: 0, message: i18n.get('doctor.update.success')});
        });
        return next();
    },
    getDoctorsGroupByDepartment: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        employeeDAO.findDoctorsGroupByDepartment(hospitalId).then(function (doctors) {
            if (!doctors.length) return res.send({ret: 0, data: doctors});
            res.send({
                ret: 0, data: _.groupBy(doctors, function (item) {
                    var s = item.departmentName;
                    delete item.departmentName;
                    return s;
                })
            });
        });
    }
}