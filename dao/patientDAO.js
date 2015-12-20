"use strict";
var db = require('../common/db');
var sqlMapping = require('./sqlMapping');
module.exports = {
    findGroupCompanies: function (hospitalId, page) {
        return db.queryWithCount(sqlMapping.patient.findGroupCompanies, [+hospitalId, page.from, page.size]);
    },
    insertGroupCompany: function (groupCompany) {
        return db.query(sqlMapping.patient.insertGroupCompany, groupCompany);
    },
    deleteGroupCompany: function (id) {
        return db.query(sqlMapping.patient.deleteGroupCompany, id);
    },
    updateGroupCompany: function (groupCompany) {
        return db.query(sqlMapping.patient.updateGroupCompany, [groupCompany, groupCompany.id]);
    },
    findPatients: function (hospitalId, page) {
        return db.queryWithCount(sqlMapping.patient.findPatients, [hospitalId, page.from, page.size]);
    },
    insertPrePaidHistory: function (history) {
        return db.query(sqlMapping.patient.insertPrePaidHistory, history);
    },
    updatePatientBalance: function (patientId, amount) {
        return db.query(sqlMapping.patient.updatePatientBalance, [amount, patientId]);
    },
    insertTransactionFlow: function (flow) {
        return db.query(sqlMapping.patient.insertTransactionFlow, flow);
    },
    findByPatientId: function (id) {
        return db.query(sqlMapping.patient.findByPatientId, id);
    },
    findByPatientBasicInfo: function (patientId, hospitalId) {
        return db.query(sqlMapping.patient.findByPatientBasicInfo, [patientId, hospitalId]);
    },
    findTransactionFlows: function (patientId, hospitalId) {
        return db.query(sqlMapping.patient.findTransactionFlows, [patientId, hospitalId]);
    },

    findRegistrations: function (patientId, hospitalId) {
        return db.query(sqlMapping.patient.findRegistrations, [patientId, hospitalId]);
    }
}