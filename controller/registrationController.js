"use strict";
var config = require('../config');
var i18n = require('../i18n/localeMessage');
var registrationDAO = require('../dao/registrationDAO');
var _ = require('lodash');
var moment = require('moment');
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
                registration.status = config.outpatientStatus[registration.status];
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
                registration.status = config.outpatientStatus[registration.status];
            });
            registrations.pageIndex = pageIndex;
            return res.send({ret: 0, data: registrations});
        });
        return next();
    },
    addRegistration: function (req, res, next) {
        var registration = req.body;
        businessPeopleDAO.findContactById(req.body.contactId).then(function (contacts) {
            delete registration.contactId;
            var contact = contacts[0];
            registration = _.assign(registration, {
                patientName: contact.name, patientMobile: contact.mobile,
                createDate: new Date(), patientBasicInfoId: req.user.id
            });
            return hospitalDAO.findDoctorById(registration.doctorId);
        }).then(function (doctors) {
            var doctor = doctors[0];
            registration = _.assign(registration, {
                departmentId: doctor.departmentId,
                departmentName: doctor.departmentName,
                hospitalId: doctor.hospitalId,
                hospitalName: doctor.hospitalName,
                registrationFee: doctor.registrationFee,
                doctorName: doctor.name,
                doctorJobTitle: doctor.jobTitle,
                doctorJobTitleId: doctor.jobTitleId,
                doctorHeadPic: doctor.headPic,
                paymentType: 1,
                status: 0, registrationType: 7, memberType: 1, businessPeopleId: req.user.id, creator: req.user.id
            });
            return businessPeopleDAO.findPatientBasicInfoBy(registration.patientMobile);
        }).then(function (patientBasicInfoList) {
            if (patientBasicInfoList.length) {
                registration.patientBasicInfoId = patientBasicInfoList[0].id;
                return businessPeopleDAO.insertRegistration(registration);
            }
            businessPeopleDAO.insertPatientBasicInfo({
                name: registration.patientName, mobile: registration.patientMobile,
                createDate: new Date(), password: md5('password'), creator: req.user.id
            }).then(function (result) {
                registration.patientBasicInfoId = result.insertId;
                return businessPeopleDAO.insertRegistration(registration);
            });
        }).then(function (result) {
            return businessPeopleDAO.updateShiftPlan(registration.doctorId, registration.registerDate, registration.shiftPeriod);
        }).then(function () {
            return businessPeopleDAO.findPatientByBasicInfoId(req.user.id);
        }).then(function (result) {
            if (!result)
                return redis.incrAsync('member.no.incr').then(function (memberNo) {
                    return businessPeopleDAO.insertPatient({
                        patientBasicInfoId: registration.patientBasicInfoId,
                        hospitalId: req.user.hospitalId,
                        memberType: 1,
                        memberCardNo: req.user.hospitalId.hospitalId + '-1-' + _.padLeft(memberNo, 7, '0'),
                        createDate: new Date()
                    });
                });

        }).then(function () {
            return businessPeopleDAO.findShiftPeriodById(req.user.hospitalId, registration.shiftPeriod);
        }).then(function (result) {
            return res.send({
                ret: 0,
                data: {
                    id: registration.id,
                    registerDate: registration.registerDate,
                    hospitalName: registration.hospitalName,
                    departmentName: registration.departmentName,
                    doctorName: registration.doctorName, jobTtile: registration.doctorJobTtile,
                    shiftPeriod: result[0].name
                }
            });
        });
        return next();
    }
}