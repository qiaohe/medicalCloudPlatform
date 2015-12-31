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
    findDepartmentsBy: function (hospitalId, page) {
        return db.queryWithCount(sqlMapping.department.findByHospital, [hospitalId, page.from, page.size]);
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
    },
    findProvinces: function () {
        return db.query(sqlMapping.city.findProvinces);
    },
    findCities: function (province) {
        return db.query(sqlMapping.city.findCities, [province]);
    },
    findRoles: function (hospitalId) {
        return db.query(sqlMapping.employee.findRoles, hospitalId);
    },
    findJobTitleByRole: function (hospitalId, roleId) {
        return db.query(sqlMapping.employee.findJobTitleByRole, [hospitalId, roleId]);
    },
    addShiftPlan: function (shiftPlan) {
        return db.query(sqlMapping.registration.addShiftPlan, shiftPlan);
    },
    findShiftPlansBy: function (hospitalId, doctorId) {
        return db.query(sqlMapping.registration.findShiftPlans, [hospitalId, doctorId]);
    },
    findShiftPlansByDay: function (hospitalId, doctorId, day) {
        return db.query(sqlMapping.registration.findShiftPlansByDay, [+hospitalId, +doctorId, day]);
    },
    findShiftPlansByDayWithName: function (hospitalId, doctorId, day) {
        return db.query(sqlMapping.registration.findShiftPlansByDayWithName, [+hospitalId, +doctorId, day]);
    },

    findPerformances: function (hospitalId, conditions) {
        return db.query(sqlMapping.businessPeople.findPerformances + (conditions.length ? ' and ' + conditions : '') + '  order by name, yearMonth', hospitalId);
    },

    findPerformancesBy: function (businessPeopleId) {
        return db.query(sqlMapping.businessPeople.findPerformancesBy, businessPeopleId);

    },
    addPerformance: function (performance) {
        return db.query(sqlMapping.businessPeople.insertPerformance, performance);
    },

    updatePerformance: function (performance) {
        return db.query(sqlMapping.businessPeople.updatePerformance, [performance.plannedCount, performance.businessPeopleId, performance.yearMonth]);
    },

    findWaitOutpatients: function (doctorId, registerDate) {
        return db.query(sqlMapping.doctor.findWaitOutpatients, [doctorId, registerDate])
    },
    findFinishedCountByDate: function (doctorId, registerDate) {
        return db.query(sqlMapping.doctor.findFinishedCountByDate, [doctorId, registerDate])
    },

    findHistoryOutpatients: function (doctorId) {
        return db.query(sqlMapping.doctor.findHistoryOutpatients, doctorId)
    },
    insertRole: function (role) {
        return db.query(sqlMapping.employee.insertRole, role);
    },
    deleteRole: function (id) {
        return db.query(sqlMapping.employee.deleteRole, id);
    },
    insertJobTitle: function (jobTitle) {
        return db.query(sqlMapping.employee.insertJobTitle, jobTitle);
    },
    deleteJobTitle: function (roleId, jobTitleId) {
        return db.query(sqlMapping.employee.deleteJobTitle, [roleId, jobTitleId]);
    },
    updateJobTitle: function(jobTitle) {
        return db.query(sqlMapping.employee.updateJobTitle, [jobTitle, jobTitle.id]);
    },
    updateRole: function(role) {
        return db.query(sqlMapping.employee.updateRole, [role, role.id]);
    },
}