"use strict";
var config = require('../config');
var i18n = require('../i18n/localeMessage');
var patientDAO = require('../dao/patientDAO');
var redis = require('../common/redisClient');
var businessPeopleDAO = require('../dao/businessPeopleDAO');
var _ = require('lodash');
var md5 = require('md5');
module.exports = {
    getGroupCompanies: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        patientDAO.findGroupCompanies(hospitalId, {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (companies) {
            if (!companies.rows.length) return res.send({ret: 0, data: []});
            companies.rows.forEach(function (company) {
                company.source = config.sourceType[company.source];
                company.cashbackType = config.cashbackType[company.cashbackType];
            });
            companies.pageIndex = pageIndex;
            return res.send({ret: 0, data: companies});
        });
        return next();
    },
    insertGroupCompany: function (req, res, next) {
        var groupCompany = req.body;
        groupCompany.hospitalId = req.user.hospitalId;
        patientDAO.insertGroupCompany(groupCompany).then(function (result) {
            groupCompany.id = result.insertId;
            res.send({ret: 0, data: groupCompany});
        });
        return next();
    },
    updateGroupCompany: function (req, res, next) {
        var groupCompany = req.body;
        groupCompany.hospitalId = req.user.hospitalId;
        patientDAO.updateGroupCompany(groupCompany).then(function (result) {
            res.send({ret: 0, message: i18n.get('groupCompany.update.success')});
        });
        return next();
    },
    deleteGroupCompany: function (req, res, next) {
        var id = req.params.id;
        patientDAO.deleteGroupCompany(id).then(function (result) {
            res.send({ret: 0, message: i18n.get('groupCompany.delete.success')});
        });
        return next();
    },
    getPatients: function (req, res, next) {
        var hospitalId = req.user.id;
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        patientDAO.findPatients(hospitalId, {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (patients) {
            if (!patients.rows.length) return res.send({ret: 0, data: []});
            patients.pageIndex = pageIndex;
            res.send({ret: 0, data: patients});
        });
        return next();
    },
    addPatient: function (req, res, next) {
        var uid = req.user.id;
        var patient = req.body;
        patient.hospitalId = req.user.hospitalId;
        businessPeopleDAO.findPatientBasicInfoBy(patient.mobile).then(function (basicInfos) {
            return basicInfos.length ? basicInfos[0].id : businessPeopleDAO.insertPatientBasicInfo({
                name: patient.name,
                mobile: patient.mobile,
                createDate: new Date(),
                birthday: patient.birthday,
                password: md5('password'),
                creator: req.user.id,
                gender: patient.gender,
                idCard: patient.idCard,
                headPic: patient.headPic,
                status: 0
            }).then(function (result) {
                return result.insertId;
            });
        }).then(function (result) {
            patient.patientBasicInfoId = result;
            return businessPeopleDAO.findPatientByBasicInfoId(result).then(function (patients) {
                if (patients.length) return patients[0].id;
                return redis.incrAsync('member.no.incr').then(function (memberNo) {
                    return businessPeopleDAO.insertPatient({
                        patientBasicInfoId: patient.patientBasicInfoId,
                        hospitalId: req.user.hospitalId,
                        memberType: patient.memberType,
                        memberCardNo: req.user.hospitalId + '-1-' + _.padLeft(memberNo, 7, '0'),
                        createDate: new Date(),
                        groupId: patient.groupId,
                        groupName: patient.groupName,
                        recommender: patient.recommender,
                        consumptionLevel: patient.consumptionLevel,
                        cashbackType: patient.cashbackType,
                        maxDiscountRate: patient.maxDiscountRate,
                        comment: patient.comment
                    }).then(function (result) {
                        patient.id = result.insertId;
                        res.send({ret: 0, data: patient});
                    });
                });
            });
        });
        return next();
    },

    addPrePaidHistory: function (req, res, next) {
        var prePaid = req.body;
        prePaid.createDate = new Date();
        prePaid.creator = req.user.id;
        prePaid.hospitalId = req.user.hospitalId;
        patientDAO.insertPrePaidHistory(prePaid).then(function (result) {
            prePaid.id = result.insertId;
            return patientDAO.updatePatientBalance(prePaid.patientId, prePaid.amount);
        }).then(function (result) {
            return patientDAO.findByPatientId(prePaid.patientId).then(function (patients) {
                return patientDAO.insertTransactionFlow({
                    amount: prePaid.amount,
                    createDate: new Date(),
                    hospitalId: req.user.hospitalId,
                    patientId: prePaid.patientId,
                    patientBasicInfoId: patients[0].patientBasicInfoId,
                    type: 1,
                    comment: prePaid.comment
                })
            })
        }).then(function (result) {
            res.send({ret: 0, data: i18n.get('prePaid.add.success')});
        });
        return next();
    },
    getPatient: function (req, res, next) {
        var patientId = req.params.patientId;
        var data = {};
        patientDAO.findByPatientBasicInfo(+patientId, +req.user.hospitalId).then(function (patients) {
            data.basicInfo = patients[0];
            return patientDAO.findTransactionFlows(+patientId, +req.user.hospitalId);
        }).then(function (flows) {
            data.transactionFlows = flows;
            return patientDAO.findRegistrations(+patientId, +req.user.hospitalId);
        }).then(function (registrations) {
            data.outPatients = registrations;
            res.send({ret: 0, data: data});
        });
        return next();
    }
}