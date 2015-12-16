module.exports = {
    employee: {
        findByUserName: 'select * from Employee where mobile=?',
        insert: 'insert Employee set ?',
        findByRole: 'select id, name from Employee where role=?'
    },
    businessPeople: {
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
        findShiftPeriods: 'select id, name from ShiftPeriod where hospitalId = ?'
    },
    hospital: {
        findDepartments: 'select id, name from Department where hospitalId = ?',
        findByNameLike: 'select id, name, tag from Hospital where name like ?',
        findById: 'select id, name, tag, images, address, icon, introduction from Hospital where id = ?',
        insertPatient: 'insert Patient set ?',
        findPatientByBasicInfoId: 'select * from Patient where patientBasicInfoId = ?'
    },

    department: {
        findByHospital: 'select id, name, introduction from Department where hospitalId = ?'
    },

    doctor: {
        findDoctors: 'select id, name from Doctor',
        findByDepartment: 'select id, name, departmentName, hospitalName, headPic,registrationFee, speciality,jobTitle from Doctor where hospitalId = ?  and departmentId = ?',
        findById: 'select id, name, departmentName,hospitalId, hospitalName, headPic,registrationFee, speciality,jobTitle, departmentId, jobTitleId from Doctor where id =?',
        findShitPlans: 'select p.`name` as period, `day`, actualQuantity, plannedQuantity, p.id as periodId from ShiftPlan sp, ShiftPeriod p where sp.shiftPeriod = p.id and sp.doctorId = ? and sp.day>=? and sp.day<=? and sp.actualQuantity < sp.plannedQuantity and sp.plannedQuantity > 0 order by sp.day, sp.shiftPeriod',
        findBy: 'select id, name, departmentName,hospitalId, hospitalName, headPic,registrationFee, speciality,jobTitle from Doctor where departmentId=? and registrationFee=? and id<>?'
    },

    registration: {
        insert: 'insert Registration set ?',
        updateShiftPlan: 'update ShiftPlan set actualQuantity = actualQuantity + 1 where doctorId = ? and day =? and shiftPeriod = ?',
        updateShiftPlanDec: 'update ShiftPlan set actualQuantity = actualQuantity - 1 where doctorId = ? and day =? and shiftPeriod = ?',
        findShiftPeriodById: 'select * from ShiftPeriod where hospitalId = ? and id =?',
        findRegistrationsByUid: 'select r.id, r.doctorId, doctorName, doctorHeadPic,registrationFee, departmentName,doctorJobTitle, hospitalName, patientName,concat(DATE_FORMAT(r.registerDate, \'%Y-%m-%c \') , s.`name`) as shiftPeriod, orderNo, r.status  from Registration r, ShiftPeriod s where r.shiftPeriod = s.id and paymentType =1 and patientBasicInfoId = ? and r.status <>4 order by r.id desc limit ?,?',
        findById: 'select * from Registration where id =?',
        updateRegistration: "update Registration set ? where id = ?",
        findRegistrations: 'select SQL_CALC_FOUND_ROWS r.patientMobile,r.patientName,r.gender, p.balance, p.memberCardNo, p.memberType, r.doctorName, r.`comment`, r.registrationFee, r.registrationType, r.departmentName, r.registerDate, r.outPatientType, r.status, r.sequence, r.businessPeopleName, r.preRegistrationStatus from Registration r, Patient p where r.patientId =p.id and r.hospitalId = ? limit ?, ?',
        findRegistrationsBy: 'select SQL_CALC_FOUND_ROWS r.patientMobile,r.patientName,r.gender, p.balance, p.memberCardNo, p.memberType, r.doctorName, r.`comment`, r.registrationFee, r.registrationType, r.departmentName, r.registerDate, r.outPatientType, r.status, r.sequence, r.businessPeopleName, r.preRegistrationStatus from Registration r, Patient p where r.patientId =p.id and r.hospitalId = ? and r.registerDate=? limit ?, ?'
    }
}
