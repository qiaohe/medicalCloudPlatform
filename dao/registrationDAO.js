"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    findRegistrations: function (hospitalId, conditions, page) {
        var sql = sqlMapping.registration.findRegistrations;
        sql = !conditions.length ? sql : 'select SQL_CALC_FOUND_ROWS r.patientMobile,r.patientName,r.gender, p.balance, p.memberCardNo, p.memberType, r.doctorName, r.`comment`, r.registrationFee, r.registrationType, r.departmentName, r.registerDate, r.outPatientType,r.status, r.sequence, r.businessPeopleName, r.preRegistrationStatus from Registration r, Patient p where r.patientId =p.id and r.hospitalId = ? and ' + conditions.join(' and ') + ' limit ?, ?';
        return db.queryWithCount(sql, [+hospitalId, +page.from, +page.size]);
    },
    findRegistrationsBy: function (hospitalId, registrationDate, conditions, page) {
        var sql = sqlMapping.registration.findRegistrationsBy;
        sql = !conditions.length ? sql : 'select SQL_CALC_FOUND_ROWS r.patientMobile,r.patientName,r.gender, p.balance, p.memberCardNo, p.memberType, r.doctorName, r.`comment`, r.registrationFee, r.registrationType, r.departmentName, r.registerDate, r.outPatientType, r.status, r.sequence, r.businessPeopleName, preRegistrationStatus from Registration r, Patient p where r.patientId =p.id and r.hospitalId = ? and r.registerDate=? and ' + conditions.join(' and ') + ' limit ?, ?';
        return db.queryWithCount(sql, [+hospitalId, registrationDate, +page.from, +page.size]);
    },
    updateRegistration: function (reg) {
        return db.query(sqlMapping.registration.updateRegistration, [reg, reg.id]);
    }
}