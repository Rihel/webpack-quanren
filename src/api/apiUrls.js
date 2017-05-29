const hostName = 'http://m.qren163.cn:8080/v1/api/';
export const api = {
    userLogin: hostName + 'auth/login', //登录
    orderPage: hostName + 'order/page', //预约列表
    userGet: hostName + 'user/get', //获取用户信息
    userStatus: hostName + 'user/status', //获取用户状态

    register: hostName + 'auth/register', //注册
    vcode: hostName + 'auth/reg/vcode', //获取验证码


    getDraftBox: hostName + 'user/draftbox/get', //获取用户注册草稿箱
    saveDraftBox: hostName + 'user/draftbox/save', //保存用户注册草稿箱

    carbrand: hostName + 'dict/carbrand/list', //车品牌
    carmodel: hostName + 'dict/carmodel/list', //车型
    lpprefix: hostName + 'dict/lpprefix/list',

    clitype: hostName + 'dict/clitype/list', //客户类型
    clitStatus: hostName + 'dict/clitstatus/list', //客户状态


    province: hostName + 'dict/province/list', //省份
    city: hostName + 'dict/city/list', //城市
    district: hostName + 'dict/district/list', //城区列表

    payStatus: hostName + 'dict/paystatus/list', //支付状态

    providerList: hostName + 'provider/list', //服务商列表
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