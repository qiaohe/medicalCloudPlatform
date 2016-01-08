"use strict";
var config = require('../config');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var redis = require('../common/redisClient');
var _ = require('lodash');
var i18n = require('../i18n/localeMessage');
var businessPeopleDAO = require('../dao/businessPeopleDAO');
var hospitalDAO = require('../dao/hospitalDAO');
var md5 = require('md5');
module.exports = {
    getPerformanceByMonth: function (req, res, next) {
        var yearMonth = req.params.yearMonth;
        businessPeopleDAO.findPerformanceByMonth(req.user.id, yearMonth).then(function (performances) {
            if (!performances.length) return res.send({ret: 0, data: []});
            res.send({ret: 0, data: performances[0]});
        });
        return next();
    },
    getPerformanceByYear: function (req, res, next) {
        var year = req.params.year;
        businessPeopleDAO.findPerformanceByYear(req.user.id, year).then(function (performances) {
            if (!performances.length) return res.send({ret: 0, data: []});
            performances[0].completePercentage = (performances[0].actualCount / performances[0].plannedCount).toFixed(2);
            res.send({ret: 0, data: performances[0]});
        });
        return next();
    },
    getContacts: function (req, res, next) {
        var uid = req.user.id;
        businessPeopleDAO.findContactsBy(uid, {from: req.query.from, size: req.query.size}).then(function (contacts) {
            if (!contacts.length) return res.send({ret: 0, data: []});
            contacts.forEach(function (contact) {
                contact.source = config.sourceType[contact.source];
            });
            res.send({ret: 0, data: contacts});
        });
        return next();
    },
    getContactsByBusinessPeopleId: function (req, res, next) {
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        businessPeopleDAO.findContactsByPagable(req.params.id, {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (contacts) {
            if (!contacts.rows.length) return res.send({ret: 0, data: {rows: []}});
            contacts.rows.forEach(function (contact) {
                contact.source = config.sourceType[contact.source];
            });
            contacts.pageIndex = pageIndex;
            res.send({ret: 0, data: contacts});
        });
        return next();
    },

    transferContact: function (req, res, next) {
        var transfer = req.body;
        businessPeopleDAO.transferContact(transfer.toBusinessPeopleId, transfer.contacts.join(',')).then(function (rsult) {
            transfer.createDate = new Date();
            transfer.creator = req.user.id;
            transfer.hospitalId = req.user.hospitalId;
            delete transfer.contacts;
            return businessPeopleDAO.addTransferHistory(transfer);
        }).then(function (result) {
            res.send({ret: 0, message: '转移成功'});
        });
        return next();
    },
    addContact: function (req, res, next) {
        var contact = req.body;
        contact.businessPeopleId = req.user.id;
        businessPeopleDAO.findContactBusinessPeopleIdAndMobile(req.user.id, contact.mobile).then(function (contacts) {
            if (contacts.length) {
                contact = contacts[0];
                return businessPeopleDAO.updateContact(contact.id);
            }
            return businessPeopleDAO.insertContact(_.assign(contact, {
                createDate: new Date(),
                inviteTimes: 1,
                inviteResult: '未安装'
            }))
        }).then(function (result) {
            if (result.insertId)
                contact.id = result.insertId;
            return businessPeopleDAO.insertInvitation({
                createDate: new Date(),
                contactId: contact.id,
                businessPeopleId: req.user.id,
                status: 0,
                invitationCode: _.random(1000, 9999)
            })
        }).then(function (result) {
            res.send({ret: 0, message: i18n.get('contacts.add.success')});
        });
        return next();
    },
    preRegistrationForContact: function (req, res, next) {
        var registration = req.body;
        businessPeopleDAO.findContactById(req.body.contactId).then(function (contacts) {
            delete registration.contactId;
            var contact = contacts[0];
            registration = _.assign(registration, {
                patientName: contact.name, patientMobile: contact.mobile,
                createDate: new Date()
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
                return redis.incrAsync('doctor:' + registration.doctorId + ':d:' + registration.registerDate + ':incr').then(function (seq) {
                    registration.sequence = seq;
                    registration.outPatientType = 0;
                    registration.outpatientStatus = 5;
                    return businessPeopleDAO.findPatientByBasicInfoId(registration.patientBasicInfoId);
                });
            }
            businessPeopleDAO.insertPatientBasicInfo({
                name: registration.patientName, mobile: registration.patientMobile,
                createDate: new Date(), password: md5('password'), creator: req.user.id
            }).then(function (result) {
                registration.patientBasicInfoId = result.insertId;
                return redis.incrAsync('doctor:' + registration.doctorId + ':d:' + registration.registerDate + ':incr').then(function (seq) {
                    registration.sequence = seq;
                    registration.outPatientType = 0;
                    registration.outpatientStatus = 5;
                    return businessPeopleDAO.findPatientByBasicInfoId(registration.patientBasicInfoId);
                });
            });
        }).then(function (result) {
            if (!result.length) {
                return redis.incrAsync('member.no.incr').then(function (memberNo) {
                    return businessPeopleDAO.insertPatient({
                        patientBasicInfoId: registration.patientBasicInfoId,
                        hospitalId: req.user.hospitalId,
                        memberType: 1,
                        balance: 0.00,
                        memberCardNo: req.user.hospitalId.hospitalId + '-1-' + _.padLeft(memberNo, 7, '0'),
                        createDate: new Date()
                    }).then(function (patient) {
                        registration.patientId = patient.insertId;
                    });
                });
            } else {
                registration.patientId = result[0].id;
            }
            return businessPeopleDAO.insertRegistration(registration);
        }).then(function () {
            return businessPeopleDAO.updateShiftPlan(registration.doctorId, registration.registerDate, registration.shiftPeriod);
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
    },
    getPreRegistrationForContact: function (req, res, next) {
        var uid = req.user.id;
        var mobile = req.query.mobile;
        businessPeopleDAO.findRegistrationByUid(uid, mobile, {
            from: +req.query.from,
            size: +req.query.size
        }).then(function (registrations) {
            registrations && registrations.forEach(function (registration) {
                registration.status = registration.status == null ? null : config.registrationStatus[registration.status];
            });
            res.send({ret: 0, data: registrations});
        });
        return next();
    }
}