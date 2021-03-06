"use strict";
var config = require('../config');
var _ = require('lodash');
var hospitalDAO = require('../dao/hospitalDAO');
var Promise = require('bluebird');
var businessPeopleDAO = require('../dao/businessPeopleDAO');
var redis = require('../common/redisClient');
var i18n = require('../i18n/localeMessage');
module.exports = {
    getDepartments: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findDepartments(hospitalId).then(function (departments) {
            res.send({ret: 0, data: departments});
        });
        return next();
    },
    getDoctors: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findDoctors(hospitalId).then(function (doctors) {
            res.send({ret: 0, data: doctors});
        });
        return next();
    },

    getBusinessPeople: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var name = req.query.name;
        businessPeopleDAO.findBusinessPeople(hospitalId, name).then(function (result) {
            res.send({ret: 0, data: result});
        });
        return next();
    },

    getNoPlanBusinessPeople: function (req, res, next) {
        var year = req.params.year;
        var hospitalId = req.user.hospitalId;
        businessPeopleDAO.findNoPlanBusinessPeople(hospitalId, year).then(function (result) {
            res.send({ret: 0, data: result});
        });
        return next();
    },
    getShiftPeriods: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        businessPeopleDAO.findShiftPeriods(hospitalId).then(function (result) {
            res.send({ret: 0, data: result});
        });
        return next();
    },

    getAvailablePeriods: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        var doctorId = req.params.doctorId;
        var day = req.query.day;
        businessPeopleDAO.findAvailableShiftPeriods(hospitalId, doctorId, day).then(function (result) {
            res.send({ret: 0, data: result});
        });
        return next();
    },

    addShiftPeriod: function (req, res, next) {
        var period = req.body;
        period.hospitalId = req.user.hospitalId;
        period.enabled = true;
        businessPeopleDAO.addShiftPeriod(period).then(function (result) {
            return businessPeopleDAO.findShiftPeriods(period.hospitalId);
        }).then(function (shiftPeriods) {
            Promise.map(shiftPeriods, function (period, index) {
                redis.setAsync('h:' + req.user.hospitalId + ':p:' + period.id, String.fromCharCode(65 + index))
            }).then(function (result) {
                res.send({ret: 0, data: {id: result.insertId, name: period.name}});
            })
        });
        return next();
    },

    removeShiftPeriod: function (req, res, next) {
        businessPeopleDAO.deleteShiftPeriod(req.params.id).then(function (result) {
            return businessPeopleDAO.findShiftPeriods(req.user.hospitalId);
        }).then(function (shiftPeriods) {
            Promise.map(shiftPeriods, function (period, index) {
                redis.setAsync('h:' + req.user.hospitalId + ':p:' + period.id, String.fromCharCode(65 + index))
            }).then(function (result) {
                res.send({ret: 0, message: i18n.get('shiftPeriod.remove.success')});
            })
        });
        return next();
    },

    editShiftPeriod: function (req, res, next) {
        businessPeopleDAO.updateShiftPeriod(req.body.name, req.body.id).then(function (result) {
            res.send({ret: 0, message: i18n.get('shiftPeriod.update.success')});
        });
        return next();
    },

    getRegistrationFee: function (req, res, next) {
        hospitalDAO.findDoctorById(req.params.doctorId).then(function (doctors) {
            return res.send({ret: 0, data: {id: doctors[0].id, registrationFee: doctors[0].registrationFee}});
        });
        return next();
    },

    getJobTitles: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findJobTitles(hospitalId).then(function (jobs) {
            res.send({ret: 0, data: jobs});
        });
        return next();
    },
    getProvinces: function (req, res, next) {
        hospitalDAO.findProvinces().then(function (provinces) {
            res.send({ret: 0, data: provinces});
        });
        return next();
    },

    getCities: function (req, res, next) {
        hospitalDAO.findCities(req.params.province).then(function (cities) {
            res.send({ret: 0, data: cities});
        });
        return next();
    },
    getRoles: function (req, res, next) {
        var hospitalId = req.user.hospitalId;
        hospitalDAO.findRoles(hospitalId).then(function (roles) {
            res.send({ret: 0, data: roles});
        });
        return next();
    },
    addRole: function (req, res, next) {
        req.body.hospitalId = req.user.hospitalId;
        hospitalDAO.insertRole(req.body).then(function (result) {
            req.body.id = result.insertId;
            res.send(req.body);
        });
        return next();
    },

    removeRole: function (req, res, next) {
        hospitalDAO.deleteRole(req.params.id).then(function () {
            res.send({ret: 0, message: i18n.get('role.remove.success')});
        });
        return next();
    },

    getJobTitlesByRole: function (req, res, next) {
        hospitalDAO.findJobTitleByRole(req.user.hospitalId, req.params.roleId).then(function (jobTitles) {
            res.send({ret: 0, data: jobTitles});
        });
        return next();
    },
    addJobTitlesByRole: function (req, res, next) {
        req.body.hospitalId = req.user.hospitalId;
        req.body.role = req.params.roleId;
        hospitalDAO.insertJobTitle(req.body).then(function (result) {
            req.body.id = result.insertId;
            res.send(req.body);
        });
        return next();
    },
    removeJobTitlesByRole: function (req, res, next) {
        hospitalDAO.deleteJobTitle(req.params.roleId, req.params.id).then(function () {
            res.send({ret: 0, message: i18n.get('jobTitle.remove.success')});
        });
        return next();
    },
    editJobTitlesByRole: function (req, res, next) {
        hospitalDAO.updateJobTitle(req.body).then(function () {
            res.send({ret: 0, message: i18n.get('update.jobTitle.success')});
        });
        return next();
    },
    editRole: function (req, res, next) {
        hospitalDAO.updateRole(req.body).then(function () {
            res.send({ret: 0, message: i18n.get('update.role.success')});
        });
        return next();
    },
    getMyMenus: function (req, res, next) {
        hospitalDAO.findMyMenus(req.user.id).then(function (menus) {
            var result = [];
            menus.length && menus.forEach(function (menu) {
                if (!menu.pid) {
                    result.push({id: menu.id, name: menu.name, routeUri: menu.routeUri, icon: menu.icon, subItems: []});
                } else {
                    var item = _.findWhere(result, {id: menu.pid});
                    item.subItems.push({
                        id: menu.id,
                        name: menu.name,
                        routeUri: menu.routeUri,
                        icon: menu.icon,
                        subItems: []
                    });
                }
            });
            res.send({ret: 0, data: result});
        });
        return next();
    },
    getMenus: function (req, res, next) {
        hospitalDAO.findMenus().then(function (menus) {
            res.send({ret: 0, data: menus});
        });
        return next();
    },
    getMenusOfJobTitle: function (req, res, next) {
        var jobTitleId = req.params.id;
        hospitalDAO.findMenusByJobTitle(jobTitleId).then(function (result) {
            res.send({ret: 0, data: result});
        });
        return next();
    },
    postMenusOfJobTitle: function (req, res, next) {
        var jobTitleId = req.params.id;
        hospitalDAO.findJobTitleMenuItem(jobTitleId, req.params.menuItemId).then(function (items) {
            return items.length ? hospitalDAO.deleteMenuByJobTitle(jobTitleId, req.params.menuItemId) : hospitalDAO.insertMenuItem({
                jobTitleId: jobTitleId,
                menuItem: req.params.menuItemId
            });
        }).then(function (result) {
            res.send({ret: 0, message: '设置权限成功'});
        });
        return next();
    }
}