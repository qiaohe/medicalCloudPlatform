"use strict";
var config = require('../config');
var i18n = require('../i18n/localeMessage');
var registrationDAO = require('../dao/registrationDAO');
var businessPeopleDAO = require('../dao/businessPeopleDAO');
var hospitalDAO = require('../dao/hospitalDAO');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var redis = require('../common/redisClient');
var md5 = require('md5');
function getConditions(req) {
    var conditions = [];
    if (req.query.memberType) conditions.push('r.memberType=' + req.query.memberType);
    if (req.query.outPatientType) conditions.push('r.outPatientType=' + req.query.outPatientType);
    if (req.query.departmentId) conditions.push('r.departmentId=' + req.query.departmentId);
    if (req.query.doctorId) conditions.push('r.doctorId=' + req.query.doctorId);
    if (req.query.registrationType) conditions.push('r.registrationType=' + req.query.registrationType);
    if (req.query.patientName) conditions.push('r.patientName like \'%' + req.query.patientName + '%\'');
    if (req.query.patientMobile) conditions.push('r.patientMobile like \'%' + req.query.patientMobile + '%\'');
    if (req.query.status) conditions.push('r.status=' + req.query.status);
    if (req.query.recommender) conditions.push('r.recommender=' + req.query.recommender);
    return conditions;
}
module.exports = {
    getRegistrations: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var pageIndex = req.query.pageIndex;
        var pageSize = req.query.pageSize;
        registrationDAO.findRegistrations(hospitalId, getConditions(req), {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (registrations) {
            registrations.rows && registrations.rows.forEach(function (registration) {
                registration.registrationType = config.registrationType[registration.registrationType];
                registration.gender = config.gender[registration.gender];
                registration.memberType = config.memberType[registration.memberType];
                registration.outPatientType = config.outPatientType[registration.outPatientType];
                registration.status = config.registrationStatus[registration.status];
                registration.outpatientStatus = config.outpatientStatus[registration.outpatientStatus];
            });
            registrations.pageIndex = pageIndex;
            return res.send({ret: 0, data: registrations});
        });
        return next();
    },

    getTodayRegistrations: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var pageIndex = req.query.pageIndex;
        var pageSize = req.query.pageSize;
        registrationDAO.findRegistrationsBy(hospitalId, moment().format('YYYY-MM-DD'), getConditions(req), {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (registrations) {
            registrations.rows && registrations.rows.forEach(function (registration) {
                registration.registrationType = config.registrationType[registration.registrationType];
                registration.gender = config.gender[registration.gender];
                registration.memberType = config.memberType[registration.memberType];
                registration.outPatientType = config.outPatientType[registration.outPatientType];
                registration.status = config.registrationStatus[registration.status];
            });
            registrations.pageIndex = pageIndex;
            return res.send({ret: 0, data: registrations});
        });
        return next();
    },
    addRegistration: function (req, res, next) {
        var r = req.body;
        r.createDate = new Date();
        businessPeopleDAO.findShiftPlanByDoctorAndShiftPeriod(r.doctorId, r.registerDate, r.shiftPeriod).then(function (plans) {
            if (!plans.length || (plans[0].plannedQuantity < +plans[0].actualQuantity + 1)) {
                return res.send({ret: 0, message: i18n.get('doctor.shift.plan.invalid')});
            }
            return businessPeopleDAO.findPatientBasicInfoBy(r.patientMobile).then(function (basicInfos) {
                return basicInfos.length ? basicInfos[0].id : businessPeopleDAO.insertPatientBasicInfo({
                    name: r.patientName,
                    mobile: r.patientMobile,
                    createDate: new Date(),
                    password: md5('password'),
                    creator: req.user.id
                }).then(function (result) {
                    return result.insertId;
                });
            }).then(function (result) {
                r.patientBasicInfoId = result;
                return businessPeopleDAO.findPatientByBasicInfoId(result).then(function (patients) {
                    if (patients.length) return patients[0].id;
                    return redis.incrAsync('member.no.incr').then(function (memberNo) {
                        return businessPeopleDAO.insertPatient({
                            patientBasicInfoId: r.patientBasicInfoId,
                            hospitalId: req.user.hospitalId,
                            memberType: 1,
                            memberCardNo: req.user.hospitalId + '-1-' + _.padLeft(memberNo, 7, '0'),
                            createDate: new Date()
                        }).then(function (patient) {
                            return patient.insertId;
                        });
                    });
                });
            }).then(function (result) {
                r.patientId = result;
                return hospitalDAO.findDoctorById(r.doctorId);
            }).then(function (doctors) {
                var doctor = doctors[0];
                r = _.assign(r, {
                    departmentId: doctor.departmentId,
                    departmentName: doctor.departmentName,
                    hospitalId: doctor.hospitalId,
                    hospitalName: doctor.hospitalName,
                    registrationFee: doctor.registrationFee,
                    doctorName: doctor.name,
                    doctorJobTitle: doctor.jobTitle,
                    doctorJobTitleId: doctor.jobTitleId,
                    doctorHeadPic: doctor.headPic,
                    status: 0, creator: req.user.id
                });
                return redis.incrAsync('doctor:' + r.doctorId + ':d:' + r.registerDate + ':incr').then(function (seq) {
                    r.sequence = seq;
                    r.outPatientType = 0;
                    r.outpatientStatus = 5;
                    r.registrationType = 2;
                    return businessPeopleDAO.insertRegistration(r)
                });
            }).then(function (result) {
                r.id = result.insertId;
                return businessPeopleDAO.updateShiftPlan(r.doctorId, r.registerDate, r.shiftPeriod);
            }).then(function (result) {
                res.send({ret: 0, dta: r})
            });
        })
        return next();
    },

    changeRegistration: function (req, res, next) {
        req.body.id = req.params.rid;
        req.body.status = 3;
        registrationDAO.updateRegistration(req.body).then(function () {
            return res.send({ret: 0, message: i18n.get('registration.update.success')});
        });
        return next();
    },

    cancelRegistration: function (req, res, next) {
        var registration = {};
        var rid = req.params.rid;
        businessPeopleDAO.findRegistrationById(rid).then(function (rs) {
            registration = rs[0];
            return registrationDAO.updateShiftPlanDec(registration.doctorId, moment(registration.registerDate).format('YYYY-MM-DD'), registration.shiftPeriod)
        }).then(function () {
            return registrationDAO.updateRegistration({
                id: req.params.rid,
                status: 4,
                updateDate: new Date(),
                outPatientStatus: 6
            })
        }).then(function () {
            res.send({ret: 0, message: i18n.get('preRegistration.cancel.success')});
        });
        return next();
    },
    getRegistration: function (req, res, next) {
        var rid = req.params.rid;
        registrationDAO.findRegistrationsById(rid).then(function (result) {
            res.send({ret: 0, data: result[0]});
        });
        return next();
    }
}