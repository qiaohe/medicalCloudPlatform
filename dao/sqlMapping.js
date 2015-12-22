module.exports = {
    employee: {
        findByUserName: 'select * from Employee where mobile=?',
        insert: 'insert Employee set ?',
        findByRole: 'select id, name from Employee where role=?',
        updateEmployee: 'update Employee set ? where id = ?',
        findEmployees: 'select * from Employee where status <> 2 and hospitalId =? order by createDate desc limit ?,?',
        findRoles: 'select id, name from Role where hospitalId = ?',
        findJobTitleByRole: 'select id, name from JobTitle where hospitalId = ? and role =?'
    },
    businessPeople: {
        updatePatientBasicInfo: 'update PatientBasicInfo set ? where id = ?',
        findRegistrationsByUid: 'select r.id, r.patientMobile, r.doctorId, doctorName, doctorHeadPic,registrationFee, departmentName,doctorJobTitle, hospitalName, patientName,concat(DATE_FORMAT(r.registerDate, \'%Y-%m-%c \') , s.`name`) as shiftPeriod, orderNo, r.status  from Registration r, ShiftPeriod s where r.shiftPeriod = s.id and creator = ? and r.registrationType <>7 order by r.id desc limit ?,?',
        findRegistrationsByUidAndMobile: 'select r.id, r.patientMobile, r.doctorId, doctorName, doctorHeadPic,registrationFee, departmentName,doctorJobTitle, hospitalName, patientName,concat(DATE_FORMAT(r.registerDate, \'%Y-%m-%d \') , s.`name`) as shiftPeriod, orderNo, r.status  from Registration r, ShiftPeriod s where r.shiftPeriod = s.id and creator = ? and r.patientMobile=? and r.registrationType =7 order by r.id desc limit ?,?',
        findShiftPeriodById: 'select * from ShiftPeriod where hospitalId = ? and id =?',
        insertPatient: 'insert Patient set ?',
        findPatientByBasicInfoId: 'select * from Patient where patientBasicInfoId = ?',
        insertPatientBasicInfo: 'insert PatientBasicInfo set ?',
        findPatientBasicInfoBy: 'select * from PatientBasicInfo where mobile=?',
        updateShiftPlan: 'update ShiftPlan set actualQuantity = actualQuantity + 1 where doctorId = ? and day =? and shiftPeriod = ?',
        insertRegistration: 'insert Registration set ?',
        findContactById: 'select * from InvitationContact where id = ?',
        insertInvitation: 'insert Invitation set ?',
        updateContact: 'update InvitationContact set inviteTimes = inviteTimes + 1 where id =?',
        findContactBusinessPeopleIdAndMobile: 'select * from InvitationContact where businessPeopleId=? and mobile=?',
        insertContact: 'insert InvitationContact set ?',
        findPerformanceByMonth: 'select actualCount, plannedCount, ROUND(actualCount / plannedCount, 2) as completePercentage from Performance where businessPeopleId = ? and yearMonth=?',
        findPerformanceByYear: 'select sum(actualCount)as actualCount, sum(plannedCount)  as plannedCount from Performance where businessPeopleId = ? and SUBSTRING(yearMonth, 1, 4) = ?',
        findContactsBy: 'select id, mobile, name, createDate, inviteTimes, source, inviteResult from InvitationContact where businessPeopleId=?',
        findContactsByPagable: 'select SQL_CALC_FOUND_ROWS ic.id, ic.mobile, ic.name, ic.createDate, ic.inviteTimes, ic.source, ic.inviteResult,gc.`name` as groupName from InvitationContact ic left join GroupCompany gc on gc.id = ic.groupId where ic.businessPeopleId=? limit ?, ?',
        findShiftPeriods: 'select id, name from ShiftPeriod where hospitalId = ?',
        transferContact: 'update InvitationContact set businessPeopleId=? where id in ',
        addTransferHistory: 'insert ContactTransferHistory set ?',
        insertPerformance: 'insert Performance set ?',
        findPerformances: 'select e.id as businessPeopleId, e.`name`,d.`name` as department, p.yearMonth, actualCount, plannedCount,ROUND(actualCount / plannedCount, 2) as completePercentage from Performance p, Employee e, Department d where e.id = p.businessPeopleId and e.department = d.id'
    },
    hospital: {
        findDepartments: 'select id, name from Department where hospitalId = ?',
        findByNameLike: 'select id, name, tag from Hospital where name like ?',
        findById: 'select id, name, tag, images, address, icon, introduction from Hospital where id = ?',
        insertPatient: 'insert Patient set ?',
        findPatientByBasicInfoId: 'select * from Patient where patientBasicInfoId = ?',
        findJobTitles: 'select id, name from JobTitle where hospitalId =?',
        update: 'update Hospital set ? where id = ?'
    },

    department: {
        findByHospital: 'select * from Department where hospitalId = ?',
        insert: 'insert Department set ?',
        update: 'update Department set ? where id = ?',
        delete: 'delete from Department where id=?'
    },

    doctor: {
        findDoctors: 'select id, name from Doctor',
        findDoctorsByHospital: 'select SQL_CALC_FOUND_ROWS d.*, e.birthday, e.clinic, e.mobile from Doctor d, Employee e where e.id = d.employeeId and d.status <> 2 and d.hospitalId = ? limit ?, ?',
        findDoctorsGroupByDepartment: 'select id, name, departmentName from Doctor where status <> 2 and hospitalId = ?',
        findByDepartment: 'select id, name, departmentName, hospitalName, headPic,registrationFee, speciality,jobTitle from Doctor where hospitalId = ?  and departmentId = ?',
        findById: 'select id, name, departmentName,hospitalId, hospitalName, headPic,registrationFee, speciality,jobTitle, departmentId, jobTitleId from Doctor where id =?',
        findShitPlans: 'select p.`name` as period, `day`, actualQuantity, plannedQuantity, p.id as periodId from ShiftPlan sp, ShiftPeriod p where sp.shiftPeriod = p.id and sp.doctorId = ? and sp.day>=? and sp.day<=? and sp.actualQuantity < sp.plannedQuantity and sp.plannedQuantity > 0 order by sp.day, sp.shiftPeriod',
        findBy: 'select id, name, departmentName,hospitalId, hospitalName, headPic,registrationFee, speciality,jobTitle from Doctor where departmentId=? and registrationFee=? and id<>?',
        update: 'update Doctor set ? where id = ?',
        delete: 'delete from Doctor where id=?'
    },

    registration: {
        addShiftPlan: 'insert ShiftPlan set ?',
        findShiftPlans: 'select day, shiftPeriod, actualQuantity, plannedQuantity from ShiftPlan where hospitalId = ? and doctorId = ? order by day desc',
        findShiftPlansByDay: 'select shiftPeriod, actualQuantity, plannedQuantity from ShiftPlan where hospitalId = ? and doctorId = ? and day = ? order by shiftPeriod desc',
        insert: 'insert Registration set ?',
        updateShiftPlan: 'update ShiftPlan set actualQuantity = actualQuantity + 1 where doctorId = ? and day =? and shiftPeriod = ?',
        updateShiftPlanDec: 'update ShiftPlan set actualQuantity = actualQuantity - 1 where doctorId = ? and day =? and shiftPeriod = ?',
        findShiftPeriodById: 'select * from ShiftPeriod where hospitalId = ? and id =?',
        findRegistrationsByUid: 'select r.id, r.doctorId, doctorName, doctorHeadPic,registrationFee, departmentName,doctorJobTitle, hospitalName, patientName,concat(DATE_FORMAT(r.registerDate, \'%Y-%m-%c \') , s.`name`) as shiftPeriod, orderNo, r.status  from Registration r, ShiftPeriod s where r.shiftPeriod = s.id and paymentType =1 and patientBasicInfoId = ? and r.status <>4 order by r.id desc limit ?,?',
        findById: 'select * from Registration where id =?',
        updateRegistration: "update Registration set ? where id = ?",
        findRegistrations: 'select SQL_CALC_FOUND_ROWS r.id, r.patientMobile,r.patientName,r.gender, p.balance, p.memberCardNo, p.memberType, r.doctorName, r.`comment`, r.registrationFee, r.registrationType, r.departmentName, r.registerDate, r.outPatientType, r.status, r.sequence, r.businessPeopleName, r.preRegistrationStatus from Registration r, Patient p where r.patientId =p.id and r.hospitalId = ? limit ?, ?',
        findRegistrationsById: 'select * from Registration where id=?',
        findRegistrationsBy: 'select SQL_CALC_FOUND_ROWS r.id, r.patientMobile,r.patientName,r.gender, p.balance, p.memberCardNo, p.memberType, r.doctorName, r.`comment`, r.registrationFee, r.registrationType, r.departmentName, r.registerDate, r.outPatientType, r.status, r.sequence, r.businessPeopleName, r.preRegistrationStatus from Registration r, Patient p where r.patientId =p.id and r.hospitalId = ? and r.registerDate=? limit ?, ?'
    },
    patient: {
        updatePatient: 'update Patient set ? where id = ?',
        findGroupCompanies: 'select SQL_CALC_FOUND_ROWS gc.*, e.`name` as recommenderName from GroupCompany gc left JOIN Employee e on e.id = gc.recommender where gc.hospitalId=? limit ?, ?',
        updateGroupCompany: 'update GroupCompany set ? where id = ?',
        deleteGroupCompany: 'delete from GroupCompany where id = ?',
        insertGroupCompany: 'insert GroupCompany set ?',
        findPatients: 'select SQL_CALC_FOUND_ROWS p.id, pb.`name`, pb.gender, pb.headPic,pb.birthday, pb.mobile, p.memberCardNo,p.memberType,p.source,e.`name` as recommenderName,p.consumptionLevel, gc.`name` as groupName, p.groupId from Patient p left JOIN Employee e on e.id = p.recommender left JOIN GroupCompany gc on gc.id = p.groupId, PatientBasicInfo pb where p.patientBasicInfoId = pb.id and p.hospitalId =? order BY p.createDate desc limit ?, ?',
        insertPrePaidHistory: 'insert PrepaidHistory set ?',
        updatePatientBalance: 'update Patient set balance = balance + ? where id =?',
        insertTransactionFlow: 'insert TransactionFlow set ?',
        findByPatientId: 'select * from Patient where id=?',
        findByPatientBasicInfo: 'select e.id as recommenderId, pb.address, pb.idCard, p.balance, p.cashbackType, p.`comment`, p.maxDiscountRate, p.source, p.id, pb.`name`, pb.gender, pb.headPic,pb.birthday, pb.mobile, p.memberCardNo,p.memberType,p.source,e.`name` as recommenderName,p.consumptionLevel, gc.`name` as groupName, p.groupId  from Patient p left JOIN Employee e on e.id = p.recommender LEFT JOIN GroupCompany gc on gc.id =p.groupId , PatientBasicInfo pb where p.patientBasicInfoId = pb.id and p.id = ? and p.hospitalId =?',
        findTransactionFlows: 'select * from TransactionFlow where patientId=? and hospitalId = ?',
        findRegistrations: 'select * from Registration where patientId = ? and hospitalId = ?',
        findGroupCompanyById: 'select gc.*, e.`name` as recommenderName from GroupCompany gc left JOIN Employee e on e.id = gc.recommender where gc.id=?'
    },
    city: {
        findProvinces: 'select DISTINCT province from city',
        findCities: 'select cityId, city from city where province=?'
    }
}
