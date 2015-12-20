var authController = require('./controller/authController');
var thirdPartyController = require('./controller/thirdPartyController');
var employeeController = require('./controller/employeeController');
var businessPeopleController = require('./controller/businessPeopleController');
var hospitalController = require('./controller/hospitalController');
var registrationController = require('./controller/registrationController');
var dictController = require('./controller/dictController');
var patientController = require('./controller/patientController');

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
        path: '/api/employees',
        handler: employeeController.addEmployee,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/employees",
        handler: employeeController.getEmployees,
        secured: 'user'
    },

    {
        method: "put",
        path: "/api/employees",
        handler: employeeController.updateEmployee,
        secured: 'user'
    },
    {
        method: "del",
        path: "/api/employees/:id",
        handler: employeeController.deleteEmployee,
        secured: 'user'
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
        method: "put",
        path: "/api/departments",
        handler: hospitalController.updateDepartment,
        secured: 'user'
    },
    {
        method: "del",
        path: "/api/departments/:id",
        handler: hospitalController.removeDepartment,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/departments",
        handler: hospitalController.addDepartment,
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
        method: "post",
        path: "/api/registrations",
        handler: registrationController.addRegistration,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/registrations/:rid",
        handler: registrationController.getRegistration,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/registrations/:rid",
        handler: registrationController.changeRegistration,
        secured: 'user'
    },
    {
        method: "del",
        path: "/api/registrations/:rid",
        handler: registrationController.cancelRegistration,
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
    },
    {
        method: "get",
        path: "/api/doctors/:doctorId/registrationFee",
        handler: dictController.getRegistrationFee,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/dict/jobTitles",
        handler: dictController.getJobTitles,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/employees/changePassword",
        handler: employeeController.changePassword,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/hospitals",
        handler: hospitalController.updateHospital,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/hospitals/me",
        handler: hospitalController.getHospital,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/doctors",
        handler: employeeController.getDoctors,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/groupCompanies",
        handler: patientController.getGroupCompanies,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/groupCompanies",
        handler: patientController.insertGroupCompany,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/groupCompanies",
        handler: patientController.updateGroupCompany,
        secured: 'user'
    },
    {
        method: "del",
        path: "/api/groupCompanies/:id",
        handler: patientController.deleteGroupCompany,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/departments/doctors",
        handler: employeeController.getDoctorsGroupByDepartment,
        secured: 'user'
    },
    {
        method: "put",
        path: "/api/doctors",
        handler: employeeController.updateDoctor,
        secured: 'user'
    },
    {
        method: "del",
        path: "/api/doctors/:id",
        handler: employeeController.deleteDoctor,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/dict/provinces",
        handler: dictController.getProvinces,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/dict/provinces/:province/cities",
        handler: dictController.getCities,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/patients",
        handler: patientController.getPatients,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/patients",
        handler: patientController.addPatient,
        secured: 'user'
    },
    {
        method: "post",
        path: "/api/prePaidHistories",
        handler: patientController.addPrePaidHistory,
        secured: 'user'
    },
    {
        method: "get",
        path: "/api/patients/:patientId",
        handler: patientController.getPatient,
        secured: 'user'
    }
];