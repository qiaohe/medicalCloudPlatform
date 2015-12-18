"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
var moment = require('moment');
module.exports = {
    findDepartments: function (hospitalId) {
        return db.query(sqlMapping.hospital.findDepartments, hospitalId);
    },
    findJobTitles: function (hospitalId) {
        return db.query(sqlMapping.hospital.findJobTitles, hospitalId);
    },

    findByUsername: function (username) {
        return db.query(sqlMapping.employee.findByUserName, username);
    },
    findDepartmentsBy: function (hospitalId) {
        return db.query(sqlMapping.department.findByHospital, hospitalId);
    },

    findDoctorsByDepartment: function (hospitalId, departmentId) {
        return db.query(sqlMapping.doctor.findByDepartment, [hospitalId, departmentId]);
    },

    findHospitalById: function (hospitalId) {
        return db.query(sqlMapping.hospital.findById, hospitalId);
    },

    findDoctorByIds: function (ids) {
        var sql = 'select id, name, departmentName,hospitalId, hospitalName, headPic,registrationFee, speciality,jobTitle ' +
            'from Doctor where id in(' + ids + ') order by field(id, ' + ids + ')';
        return db.query(sql);
    },

    findDoctorById: function (doctorId) {
        return db.query(sqlMapping.doctor.findById, doctorId);
    },
    findDoctors: function (hospital) {
        return db.query(sqlMapping.doctor.findDoctors, hospital)
    },
    findShiftPlans: function (doctorId, start) {
        var end = moment(start).add(1, 'w').format('YYYY-MM-DD');
        return db.query(sqlMapping.doctor.findShitPlans, [doctorId, start, end]);
    },
    addDepartment: function (department) {
        return db.query(sqlMapping.department.insert, department);
    },
    updateDepartment: function (department) {
        return db.query(sqlMapping.department.update, [department, department.id]);
    },
    removeDepartment: function (departmentId) {
        return db.query(sqlMapping.department.delete, +departmentId);
    },
    updateHospital: function (hospital) {
        return db.query(sqlMapping.hospital.update, [hospital, hospital.id]);
    }

}