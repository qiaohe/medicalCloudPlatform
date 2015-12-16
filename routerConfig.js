var authController = require('./controller/authController');
var thirdPartyController = require('./controller/thirdPartyController');
var employeeController = require('./controller/employeeController');
var businessPeopleController = require('./controller/businessPeopleController');
var hospitalController = require('./controller/hospitalController');
var registrationController = require('./controller/registrationController');
var dictController = require('./controller/dictController');

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
    },
    {
        method: "get",
        path: "/api/registrations/all",
        handler: registrationController.getRegistrations,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/registrations/today",
        handler: registrationController.getTodayRegistrations,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/dict/departments",
        handler: dictController.getDepartments,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/dict/doctors",
        handler: dictController.getDoctors,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/dict/businessPeoples",
        handler: dictController.getBusinessPeople,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/dict/shiftPeriods",
        handler: dictController.getShiftPeriods,
        secured: 'user'
    }

];