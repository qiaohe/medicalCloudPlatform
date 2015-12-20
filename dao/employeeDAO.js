"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    insert: function (employee) {
        return db.query(sqlMapping.employee.insert, employee);
    },
    findByUsername: function (username) {
        return db.query(sqlMapping.employee.findByUserName, username);
    },

    updateEmployee: function (employee) {
        return db.query(sqlMapping.employee.updateEmployee, [employee, employee.id])
    },

    findEmployees: function (hospitalId, page) {
        return db.queryWithCount(sqlMapping.employee.findEmployees, [hospitalId, page.from, page.size])
    },

    findDoctorsByHospital: function (hospital, page) {
        return db.queryWithCount(sqlMapping.doctor.findDoctorsByHospital, [hospital, page.from, page.size])
    },
    findDoctorsGroupByDepartment: function (hospitalId) {
        return db.query(sqlMapping.doctor.findDoctorsGroupByDepartment, hospitalId);
    },

    updateDoctor: function (doctor) {
        return db.query(sqlMapping.doctor.update, [doctor, doctor.id]);
    },
    deleteDoctor: function (id) {
        return db.query(sqlMapping.doctor.delete, id);
    }
}