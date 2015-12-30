'use strict';

module.exports = {
    server: {
        name: 'medical cloud platform',
        version: '0.0.1',
        host: 'localhost',
        port: 8080
    },
    db: {
        host: '121.42.171.213',
        port: '3306',
        user: 'root',
        password: 'heqiao75518',
        debug: false,
        multipleStatements: true,
        database: 'medicalclouddb'
    },
    app: {
        locale: 'zh_CN',
        tokenExpire: 8640000
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    qiniu: {
        ak: "ZNrhKtanGiBCTOPg4XRD9SMOAbLzy8iREzQzUP5T",
        sk: "L6VfXirR55Gk6mQ67Jn4pg7bksMpc-F5mghT0GK4",
        prefix: "http://7xoadl.com2.z0.glb.qiniucdn.com/"
    },
    jpush: {
        masterSecret: "e77461a38257ec2049387a04",
        appKey: "0fce1f73a7ac164ca3e09dc7"
    },
    registrationType: ["线上预约", "线下预约", "现场挂号", "复诊预约", "转诊挂号", "现场加号", "线上加号", "销售代约", "销售加号"],
    registrationStatus: ["预约成功", "预约未支付", "预约失败", "预约变更", "预约取消"],
    transactionType: ['挂号消费', '充值交易'],
    memberType: ['初级用户', '银卡用户', '金卡用户', '学校用户', '企业用户', '儿童用户'],
    sourceType: ['陌生拜访', '市场活动', '门诊转化', '内部转移', '特殊推荐', '广告推广'],
    gender: ['男', '女'],
    outPatientType: ["初诊", "复诊", "院内转诊", "跨院转诊", "远程会诊", "远程初诊", "远程复诊"],
    outpatientStatus: ['未到', '结束', '已转诊', '已预约复诊', '转诊中', '待诊中', '已取消'],
    cashbackType: ['赠劵', '优惠券', '免单'],
    paymentType: ['银行卡', '储值卡', '现金', '代付', '微信钱包', '支付宝'],
    consumptionLevel: ['<1000', '1000~3000', '3000~5000', '5000~10000', '>10000'],
    employeeStatus: ['在职','试用','离职']
};

