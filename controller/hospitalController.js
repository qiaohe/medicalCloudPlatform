"use strict";
var config = require('../config');
var redis = require('../common/redisClient');
var i18n = require('../i18n/localeMessage');
var hospitalDAO = require('../dao/hospitalDAO');
var registrationDAO = require('../dao/registrationDAO');
var _ = require('lodash');
var moment = require('moment');
var Promise = require("bluebird");
module.exports = {
    getDepartments: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var pageIndex = +req.query.pageIndex;
        var pageSize = +req.query.pageSize;
        hospitalDAO.findDepartmentsBy(hospitalId, {
            from: (pageIndex - 1) * pageSize,
            size: pageSize
        }).then(function (departments) {
            departments.pageIndex = pageIndex;
            return res.send({ret: 0, data: departments});
        });
        return next();
    },
    addDepartment: function (req, res, next) {
        var department = req.body;
        department.hospitalId = req.user.hospitalId;
        department.createDate = new Date();
        hospitalDAO.addDepartment(department).then(function (result) {
            department.id = result.insertId;
            res.send({ret: 0, data: department});
        });
        return next();
    },
    removeDepartment: function (req, res, next) {
        hospitalDAO.removeDepartment(req.params.id).then(function (result) {
            res.send({ret: 0, message: i18n.get('department.remove.success')});
        });
        return next();
    },
    updateDepartment: function (req, res, next) {
        var department = req.body;
        department.hospitalId = req.user.hospitalId;
        hospitalDAO.updateDepartment(department).then(function (result) {
            res.send({ret: 0, message: i18n.get('department.update.success')});
        });
        return next();
    },
    getDoctorsByDepartment: function (req, res, next) {
        var departmentId = req.params.departmentId;
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findDoctorsByDepartment(hospitalId, departmentId).then(function (doctors) {
            return res.send({ret: 0, data: doctors});
        });
        return next();
    },

    getShitPlan: function (req, res, next) {
        var doctorId = req.params.doctorId;
        var start = req.query.d;
        hospitalDAO.findShiftPlans(doctorId, start).then(function (plans) {
            var data = _.groupBy(plans, function (plan) {
                moment.locale('zh_CN');
                return moment(plan.day).format('YYYY-MM-DD dddd');
            });
            var result = [];
            for (var key in data) {
                var item = {
                    day: key, actualQuantity: _.sum(data[key], function (item) {
                        return item.actualQuantity;
                    }), plannedQuantity: _.sum(data[key], function (item) {
                        return item.plannedQuantity;
                    }), periods: data[key]
                };
                item.periods.forEach(function (object) {
                    delete object.day;
                })
                result.push(item);
            }
            res.send({ret: 0, data: result});
        });
        return next();
    },
    getDoctorById: function (req, res, next) {
        hospitalDAO.findDoctorById(req.params.doctorId).then(function (doctors) {
            var doctor = doctors[0];
            return res.send({ret: 0, data: doctor});
        });
        return next();
    },
    updateHospital: function (req, res, next) {
        var hospital = req.body;
        hospital.id = req.user.hospitalId;
        hospital.images = hospital.images && hospital.images.length && hospital.images.join(',');
        hospitalDAO.updateHospital(hospital).then(function (result) {
            res.send({ret: 0, message: i18n.get('hospital.update.success')});
        });
        return next();
    },

    getHospital: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findHospitalById(hospitalId).then(function (result) {
            result[0].images = result[0].images && result[0].images.split(',');
            res.send({ret: 0, data: result[0]});
        });
        return next();
    },
    getShiftPlansOfDoctor: function (req, res, next) {
        var doctorId = +req.params.doctorId;
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findShiftPlansBy(hospitalId, doctorId).then(function (plans) {
            var planItems = _.groupBy(plans, function (plan) {
                var d = plan.day;
                delete plan.day;
                return moment(d).format('YYYY-MM-DD');
            });
            var result = [];
            for (var item in planItems) {
                var pq = _.sum(planItems[item], 'plannedQuantity');
                result.push({day: item, title: pq});
            }
            return res.send({ret: 0, data: result});
        });
        return next();
    },

    getShiftPlansOfDay: function (req, res, next) {
        var doctorId = req.params.doctorId;
        var hospitalId = req.user.hospitalId;
        var d = req.params.day;
        var day = d.substring(0, 4) + '-' + d.substring(4, 6) + '-' + d.substring(6, 8);
        hospitalDAO.findShiftPlansByDay(hospitalId, doctorId, day).then(function (plans) {
            return res.send({ret: 0, data: plans});
        });
        return next();
    },

    addShitPlans: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var days = req.body.days;
        var shiftPeriods = req.body.shiftPeriods;
        var shiftPlans = [];
        days && days.forEach(function (day) {
            var shiftPlan = {
                createDate: new Date(),
                creator: req.user.id,
                hospitalId: req.user.hospitalId,
                doctorId: req.params.doctorId,
                actualQuantity: 0,
                day: day
            };
            shiftPeriods.forEach(function (period) {
                shiftPlan.plannedQuantity = period.quantity;
                shiftPlan.shiftPeriod = period.shiftPeriod;
                shiftPlans.push(shiftPlan);
            });
        });
        Promise.map(shiftPlans, function (shitPlan) {
            return hospitalDAO.addShiftPlan(shitPlan);
        }).then(function () {
            res.send({ret: 0, message: i18n.get('shiftPlan.add.success')});
        });
        return next();
    },

    getPerformances: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var conditions = [];
        if (req.query.name) conditions.push('e.name like \'%' + req.query.name + '%\'');
        if (req.query.department) conditions.push('d.id=' + req.query.department);
        if (req.query.start) conditions.push('p.yearMonth>=\'' + req.query.start + '\'');
        if (req.query.end) conditions.push('p.yearMonth<=\'' + req.query.end + '\'');
        hospitalDAO.findPerformances(hospitalId, conditions.join(' and ')).then(function (performances) {
            var data = [];
            performances.length && performances.forEach(function (p) {
                var item = _.findWhere(data, {
                    businessPeopleId: p.businessPeopleId,
                    name: p.name
                });
                if (!item) {
                    item = {
                        businessPeopleId: p.businessPeopleId,
                        name: p.name,
                        performances: []
                    };
                    data.push(item);
                }
                item.performances.push({
                    actualCount: p.actualCount,
                    plannedCount: p.plannedCount,
                    yearMonth: p.yearMonth,
                    completePercentage: p.completePercentage
                });
            });
            res.send({ret: 0, data: data});
        });
        return next();
    },

    getPerformancesBy: function (req, res, next) {
        var businessPeopleId = req.params.id;
        hospitalDAO.findPerformancesBy(businessPeopleId).then(function (performances) {
            var data = [];
            performances.length && performances.forEach(function (p) {
                var item = _.findWhere(data, {
                    businessPeopleId: p.businessPeopleId,
                    name: p.name
                });
                if (!item) {
                    item = {
                        businessPeopleId: p.businessPeopleId,
                        name: p.name,
                        performances: []
                    };
                    data.push(item);
                }
                item.performances.push({
                    actualCount: p.actualCount,
                    plannedCount: p.plannedCount,
                    yearMonth: p.yearMonth,
                    completePercentage: p.completePercentage
                });
            });
            res.send({ret: 0, data: data});
        });
        return next();
    },

    addPerformances: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var ps = [];
        req.body.data && req.body.data.forEach(function (item) {
            item.performances && item.performances.forEach(function (p) {
                ps.push({
                    businessPeopleId: item.businessPeopleId,
                    plannedCount: p.plannedCount,
                    actualCount: 0,
                    yearMonth: p.yearMonth
                });
            })
        });
        Promise.map(ps, function (performance) {
            return hospitalDAO.addPerformance(performance);
        }).then(function () {
            res.send({ret: 0, message: i18n.get('performance.add.success')});
        });
        return next();
    },

    editPerformances: function (req, res, next) {
        Promise.map(req.body.data, function (performance) {
            performance.businessPeopleId = req.body.businessPeopleId;
            return hospitalDAO.updatePerformance(performance);
        }).then(function () {
            res.send({ret: 0, message: i18n.get('performance.add.success')});
        });
        return next();
    },
    getOutpatients: function (req, res, next) {
        var doctorId = req.user.id;
        var today = moment().format('YYYY-MM-DD');
        var result = {
            finishedCount: 0,
            waitQueueCount: 0,
            availableCount: 0,
            authorizedCount: 0,
            availableAuthorizedCount: 0
        };
        hospitalDAO.findWaitOutpatients(doctorId, today).then(function (items) {
            items.length && items.forEach(function (item) {
                item.gender = config.gender[item.gender];
                item.registrationType = config.registrationType[item.registrationType];
                item.outPatientType = config.outPatientType[item.outPatientType];
                item.outpatientStatus = config.outpatientStatus[item.outpatientStatus];
            });
            result.waitQueue = items;
            result.waitQueueCount = items.length;
            if (items.length) {
                return registrationDAO.findCurrentQueueByRegId(items[0].id).then(function (rs) {
                    rs[0].registrationType = config.registrationType[rs[0].registrationType];
                    rs[0].outPatientType = config.outPatientType[rs[0].outPatientType];
                    rs[0].outpatientStatus = config.outpatientStatus[rs[0].outpatientStatus];
                    rs[0].memberType = config.memberType[rs[0].memberType];
                    result.currentQueue = rs[0];
                    return hospitalDAO.findHistoryOutpatients(doctorId)
                })
            } else {
                return hospitalDAO.findHistoryOutpatients(doctorId)
            }
        }).then(function (histories) {
            histories.length && histories.forEach(function (history) {
                history.gender = config.gender[history.gender];
                history.registrationType = config.registrationType[history.registrationType];
                history.outPatientType = config.outPatientType[history.outPatientType];
                history.outpatientStatus = config.outpatientStatus[history.outpatientStatus];
            });
            result.historyQueue = histories;
            return hospitalDAO.findFinishedCountByDate(doctorId, today)
        }).then(function (finishCount) {
            result.finishedCount = finishCount[0].count;
            return hospitalDAO.findShiftPlansByDayWithName(req.user.hospitalId, doctorId, today);
        }).then(function (plans) {
            result.availableCount = _.sum(plans, 'restQuantity');
            result.shiftPlans = plans;
            res.send({ret: 0, data: result});
        });
        return next();
    },

    changeOutPatientStatus: function (req, res, next) {
        req.body.finishDate = new Date();
        registrationDAO.updateRegistration(req.body).then(function (result) {
            res.send({ret: 0, message: i18n.get('outpatientStatus.change.success')});
        });
        return next();
    }
}
