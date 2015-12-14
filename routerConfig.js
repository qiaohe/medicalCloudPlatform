var authController = require('./controller/authController');
var thirdPartyController = require('./controller/thirdPartyController');
var employeeController = require('./controller/employeeController');
var businessPeopleController = require('./controller/businessPeopleController');
var hospitalController = require('./controller/hospitalController');

module.exports = [
    {
        method: "post",
        path: "/api/login",
        handler: authController.login
    },
    {
        method: "post",
        path: "/api/logout",
        handler: authController.logout,
        secured: 'user'
    },
    {
        method: 'get',
        path: '/api/qiniu/token',
        handler: thirdPartyController.getQiniuToken
    },
    {
        method: 'post',
        path: '/employees',
        handler: employeeController.addEmployee
    },
    {
        method: 'get',
        path: '/api/yearMonth/:yearMonth/performances',
        handler: businessPeopleController.getPerformanceByMonth,
        secured: 'user'
    },
    {
        method: 'get',
        path: '/api/years/:year/performances',
        handler: businessPeopleController.getPerformanceByYear,
        secured: 'user'
    },
    {
        method: 'get',
        path: '/api/contacts',
        handler: businessPeopleController.getContacts,
        secured: 'user'
    },
    {
        method: 'post',
        path: '/api/contacts',
        handler: businessPeopleController.addContact,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/departments",
        handler: hospitalController.getDepartments,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/departments/:departmentId/doctors",
        handler: hospitalController.getDoctorsByDepartment,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/doctors/:doctorId/shiftPlans",
        handler: hospitalController.getShitPlan,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/doctors/:doctorId",
        handler: hospitalController.getDoctorById,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/preRegistrationForOthers",
        handler: businessPeopleController.preRegistrationForContact,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/preRegistrationForOthers",
        handler: businessPeopleController.getPreRegistrationForContact,
        secured: 'user'
    }
];