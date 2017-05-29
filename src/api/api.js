import {
    api,
    userStatus
} from './apiUrls';
import until from '../modules/until';
import { alert, dialog } from '../modules/dialog';

/**
 * 底层函数
 */
const base = opt => {
    let option = $.extend({}, {
        xhrFields: {
            withCredentials: true
        },
        timeout: 3000, //超时时间设置，单位毫秒
        crossDomain: true,
        complete(XMLHttpRequest, status) {
            if (status == 'timeout') {
                until.closeLoading();
                dialog({
                    title: '请求超时',
                    content: '网络情况不是很好哟，刷新一下吧~~',
                    btns: ['确定刷新', '取消'],
                    btnsCallback: btns => {
                        $(btns).get(0).click(function() {
                            window.location.reload();
                        })
                    }
                })
            }
        }
    }, opt);
    $.ajax(option)
}

/**
 * 用户登录
 * @param {String} mobile 手机号码
 * @param {String} passowrd 密码
 */
export const login = (mobile, passowrd) => {
    return new Promise((resolve, reject) => {
        base({
            url: api.userLogin,
            type: 'post',
            data: {
                name: mobile,
                pwd: passowrd,
            },
            beforeSend: function() {
                until.loading('正在加载中...');
            },
            success: data => {
                // until.closeLoading();
                if (data.success) {
                    resolve(data);
                } else {
                    reject(data);
                }
            }
        })
    })
}

/**
 * 订单列表请求
 * @param {Object} arg 请求的列表数据：详情见：http://m.qren163.cn:8080
 * @return {Promise}
 */
export const orderPage = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: api.orderPage,
            data: arg,
            success: function(data) {
                if (data.success) {
                    resolve(data.data);
                }
            }
        });

    })
}


/**
 * 获取C端客户类型列表
 * @param {Number} statusCode 状态编码（1 : 只返回有效， 其它(默认） ： 全部） 
 */
export const clitypes = statusCode => {
    return new Promise((resolve, reject) => {
        base({
            url: api.clitype,
            type: 'get',
            data: {
                statusCode: statusCode || 1
            },
            success: function(data) {

                if (data.success) {
                    resolve(data.data);
                } else {
                    reject(data);
                }
            }
        })
    });
}


/**
 * 
 * 加载用户自己的基本料。
 * 此接口必须在用户成功登陆后才能调用。
 */
export const userGet = () => {
    return new Promise((resolve, reject) => {
        base({
            url: api.userGet,
            type: 'get',

            beforeSend: function() {
                until.loading('正在加载数据...')
            },
            success: function(data) {
                until.closeLoading();
                if (data.success) {
                    resolve(data);
                } else {
                    reject(data);
                }
            }
        });

    })
}


/**
 * 根据手机号码客户状态。
 * @param {String} 手机号码
 */
export const user_Status = mobile => {
    return new Promise((resolve, reject) => {
        base({
            url: api.userStatus,
            data: {
                mobile: mobile
            },
            success: function(data) {
                if (data.success) {
                    resolve(data.data);
                } else {
                    reject(data);
                };
            }
        })
    })
}


/**
 * 根据手机号码获取未提交注册的草稿数据。
 * @param {String} mobile 手机号码
 */
export const getDraftBox = mobile => {
    return new Promise((resolve, reject) => {
        base({
            url: api.getDraftBox,
            data: {
                mobile,
            },
            success: function(data) {
                if (data.success) {
                    resolve(data.data);
                }
            }
        });
    });
}


/**
 * 保存草稿箱数据
 * @param {String} mobile 手机号码
 * @param {Object} arg 其他参数
 */
export const saveDraftBox = (mobile, arg) => {
    let defa = {
        mobile,
    }
    let opts = $.extend({}, defa, arg);
    console.log(opts)
    return new Promise((resolve, reject) => {
        base({
            url: api.saveDraftBox,
            data: opts,
            success: function(data) {
                if (data.success) {
                    resolve(data);
                }
            }
        });
    });
}


/**
 * 获取汽车品牌列表
 */
export const getCarBrandList = function() {
    return new Promise((resolve, reject) => {
        base({
            url: api.carbrand,
            success: data => {
                if (data.success) {
                    resolve(data.data);
                }
            }
        });
    });
}

/**
 * 获取汽车车型
 * @param {Number} brandCode 汽车品牌编码
 */
export const getCarModelList = (brandCode) => {
    return new Promise((resolve, reject) => {
        base({
            url: api.carmodel,
            data: {
                brandCode: brandCode,
            },
            success: data => {
                if (data.success) {
                    resolve(data.data);
                }
            }
        });
    });
}


/**
 * 获取车牌前缀列表
 */
export const getLpprefixList = () => {
    return new Promise((resolve, reject) => {
        base({
            url: api.lpprefix,
            success: data => {
                if (data.success) {
                    resolve(data.data);
                }
            }
        });
    });
}


/**
 * 发送验证码
 * @param {Number} mobile 手机号码
 */
export const getVcode = mobile => {
    return new Promise((resolve, reject) => {
        base({
            url: api.vcode,
            data: {
                mobile: mobile
            },
            success: data => {

                resolve(data);

            }
        })
    });
}


/**
 * 注册账号
 * @param {Object} arg 注册信息
 */
export const register = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: api.register,
            data: arg,
            success: data => {

                resolve(data);

            }
        })
    });
}