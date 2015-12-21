"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    findPerformanceByMonth: function (businessPeopleId, yearMonth) {
        return db.query(sqlMapping.businessPeople.findPerformanceByMonth, [businessPeopleId, yearMonth]);
    },
    findPerformanceByYear: function (businessPeopleId, year) {
        return db.query(sqlMapping.businessPeople.findPerformanceByYear, [businessPeopleId, year]);
    },
    findContactsBy: function (businessPeopleId) {
        return db.query(sqlMapping.businessPeople.findContactsBy, businessPeopleId);
    },
    findContactsByPagable: function (businessPeopleId, page) {
        return db.queryWithCount(sqlMapping.businessPeople.findContactsByPagable, [businessPeopleId, page.from, page.size]);
    },

    insertContact: function (contact) {
        return db.query(sqlMapping.businessPeople.insertContact, contact);
    },

    findContactBusinessPeopleIdAndMobile: function (businessPeopleId, mobile) {
        return db.query(sqlMapping.businessPeople.findContactBusinessPeopleIdAndMobile, [businessPeopleId, mobile]);
    },
    findContactById: function (contactId) {
        return db.query(sqlMapping.businessPeople.findContactById, contactId);
    },
    updateContact: function (contactId) {
        return db.query(sqlMapping.businessPeople.updateContact, contactId);
    },
    insertInvitation: function (invitation) {
        return db.query(sqlMapping.businessPeople.insertInvitation, invitation);
    },
    insertRegistration: function (registration) {
        return db.query(sqlMapping.businessPeople.insertRegistration, registration);
    },
    updateShiftPlan: function (doctorId, registerDate, shiftPeriod) {
        return db.query(sqlMapping.businessPeople.updateShiftPlan, [doctorId, registerDate, shiftPeriod])
    },
    findPatientBasicInfoBy: function (mobile) {
        return db.query(sqlMapping.businessPeople.findPatientBasicInfoBy, mobile)
    },
    insertPatientBasicInfo: function (patientBasicInfo) {
        return db.query(sqlMapping.businessPeople.insertPatientBasicInfo, patientBasicInfo)
    },
    findPatientByBasicInfoId: function (patientBasicInfoId) {
        return db.query(sqlMapping.businessPeople.findPatientByBasicInfoId, patientBasicInfoId)
    },
    insertPatient: function (patient) {
        return db.query(sqlMapping.businessPeople.insertPatient, patient)
    },
    findShiftPeriodById: function (hospitalId, periodId) {
        return db.query(sqlMapping.businessPeople.findShiftPeriodById, [hospitalId, periodId]);
    },
    findRegistrationByUid: function (uid, mobile, page) {
        if (mobile !== undefined) return db.query(sqlMapping.businessPeople.findRegistrationsByUidAndMobile, [uid, mobile, page.from, page.size]);
        return db.query(sqlMapping.businessPeople.findRegistrationsByUid, [uid, page.from, page.size]);
    },
    findBusinessPeople: function (hospitalId) {
        return db.query(sqlMapping.employee.findByRole, '业务员');
    },
    findShiftPeriods: function (hospitalId) {
        return db.query(sqlMapping.businessPeople.findShiftPeriods, hospitalId);
    },
    transferContact: function (toBusinessPeopleId, contacts) {
        return db.query(sqlMapping.businessPeople.transferContact + '(' + contacts+ ')', [toBusinessPeopleId, contacts]);
    },

    addTransferHistory: function (history) {
        return db.query(sqlMapping.businessPeople.addTransferHistory, history);
    }
}