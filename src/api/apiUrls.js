const clientHostName = 'http://m.qren163.cn:8080/v1/api/';
const serverHostName = 'http://m.qren163.cn:8083/v1/api/'
export const clientApi = {
    userLogin: clientHostName + 'auth/login', //登录
    orderPage: clientHostName + 'order/page', //预约列表
    userGet: clientHostName + 'user/get', //获取用户信息
    userStatus: clientHostName + 'user/status', //获取用户状态

    register: clientHostName + 'auth/register', //注册
    vcode: clientHostName + 'auth/reg/vcode', //获取验证码


    getDraftBox: clientHostName + 'user/draftbox/get', //获取用户注册草稿箱
    saveDraftBox: clientHostName + 'user/draftbox/save', //保存用户注册草稿箱

    carbrand: clientHostName + 'dict/carbrand/list', //车品牌
    carmodel: clientHostName + 'dict/carmodel/list', //车型
    lpprefix: clientHostName + 'dict/lpprefix/list',

    clitype: clientHostName + 'dict/clitype/list', //客户类型
    clitStatus: clientHostName + 'dict/clitstatus/list', //客户状态


    province: clientHostName + 'dict/province/list', //省份
    city: clientHostName + 'dict/city/list', //城市
    district: clientHostName + 'dict/district/list', //城区列表

    payStatus: clientHostName + 'dict/paystatus/list', //支付状态

    providerList: clientHostName + 'provider/list', //服务商列表
}
export const serverApi = {
    login: `${serverHostName}auth/login`,
    myInfo: `${serverHostName}auth/myInfo`,

    ysummary: `${serverHostName}order/ysummary`,
    osummary: `${serverHostName}order/osummary`,
}
export const userStatus = {
    preForVal01: "0", //等待1审
    inVal01: "1", //一审中
    preVal02: "2", //等待2审
    inVal02: "3", //2审中
    failedVal01: "4", //1审 驳回
    failedVal02: "5", //2审 驳回
    disable: "6", //失效
    enable: "7", //有效
    deleted: "8", //逻辑删除
    waitForPay: "9", //一审通过,等待支付
}