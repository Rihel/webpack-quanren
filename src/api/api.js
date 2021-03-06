import {
    clientApi,
    userStatus,
    serverApi
} from './apiUrls';
import until from '../modules/until';
import { alert, dialog } from '../modules/dialog';
import '../modules/vconsole.min'

$('head').append('<link src="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css"/>')
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
                    btnsCallback: function (btns) {
                        $(btns).get(0).on('click', function () {
                            window.location.reload();
                        })
                    }
                })
            }
        }
    }, opt);

    $.ajax(option)
}

function resultHandled(resolve, data, returnData) {
    console.log(data);
    if (!data.success) {
        if (data.errorCode == 2) {
            dialog({
                title: '温馨提醒',
                content: data.errorDetail.msg,
                btns: ['确定'],
                btnsCallback: function (btns) {
                    $(btns).on('click', e => {
                        until.jumpPage('login')
                    })
                }
            })
        } else {
            alert(data.errorDetail.msg);
        }
    } else {
        resolve(returnData);
    };
}


/**
 * 用户登录
 * @param {String} mobile 手机号码
 * @param {String} passowrd 密码
 */
export const client_login = (mobile, passowrd) => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.userLogin,
            type: 'post',
            data: {
                name: mobile,
                pwd: passowrd,
            },
            beforeSend: function () {
                until.loading('正在登陆中...');
            },
            success: data => {
                until.closeLoading();
                resultHandled(resolve, data, data);
            }
        })
    })
}

/**
 * 忘记密码
 * @param {Number} mobile 手机号码
 * @param {String} passwd 新密码
 * @param {String} verifyCode 验证码
 */
export const client_passwdForget = (mobile, passwd, verifyCode) => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.passwdForget,
            type: 'post',
            data: {
                mobile, passwd, verifyCode
            },
            success: function (data) {
                resultHandled(resolve, data, data);
            }
        });

    })
}

/**
 * 重置密码
 * @param {String} newPasswd 新密码
 * @param {String} oldPasswd 旧密码
 */
export const client_passwdReset = (newPasswd, oldPasswd) => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.passwdReset,
            type: 'post',
            data: {
                newPasswd, oldPasswd
            },
            success: function (data) {
                resultHandled(resolve, data, data);
            }
        });

    })
}

/**
 * 订单列表请求
 * @param {Object} arg 请求的列表数据：详情见：http://m.qren163.cn:8080
 * @return {Promise}
 */
export const client_orderPage = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.orderPage,
            type: 'post',
            data: arg,
            success: function (data) {
                resultHandled(resolve, data, data.data);
            }
        });

    })
}

/**
 * 提交订单
 * @param {Object} arg 参数
 */
export const client_orderSubmit = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.orderSubmit,
            data: arg,
            success: function (data) {
                resultHandled(resolve, data, data);
            }
        });

    })
}

/**
 * 取消订单
 * @param {Number} orderId 订单id
 * @param {String} reason 取消原因
 */
export const client_orderCancel = (orderId, reason) => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.orderCancel,
            data: {
                orderId,
                reason
            },
            success: function (data) {

                resultHandled(resolve, data, data);
            }
        });

    })
}

/**
 * 获取服务吗
 * @param {Number} orderId 预约ID
 */
export const client_orderGetServiceno = (orderId) => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.serviceno,
            data: {
                orderId
            },
            success: function (data) {
                resultHandled(resolve, data, data);
            }
        });

    })
}

/**
 * 获取C端客户类型列表
 * @param {Number} statusCode 状态编码（1 : 只返回有效， 其它(默认） ： 全部） 
 */
export const client_clitypes = statusCode => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.clitype,
            type: 'get',
            data: {
                statusCode: statusCode || 1
            },
            success: function (data) {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}


/**
 * 
 * 加载用户自己的基本料。
 * 此接口必须在用户成功登陆后才能调用。
 */
export const client_userGet = () => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.userGet,
            type: 'get',

            beforeSend: function () {
                until.loading('正在加载数据...')
            },
            success: function (data) {
                until.closeLoading();
                resultHandled(resolve, data, data);
            }
        });

    })
}


/**
 * 根据手机号码客户状态。
 * @param {String} 手机号码
 */
export const client_user_Status = mobile => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.userStatus,
            data: {
                mobile: mobile
            },
            success: function (data) {
                resultHandled(resolve, data, data.data);
            }
        })
    })
}



/**
 * 判断是否注册
 * @param {String} 手机号码
 */
export const client_isReg = mobile => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.userStatus,
            data: {
                mobile: mobile
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
}


/**
 * 根据手机号码获取未提交注册的草稿数据。
 * @param {String} mobile 手机号码
 */
export const client_getDraftBox = mobile => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.getDraftBox,
            data: {
                mobile,
            },
            success: function (data) {
                resultHandled(resolve, data, data.data);
            }
        });
    });
}


/**
 * 保存草稿箱数据
 * @param {String} mobile 手机号码
 * @param {Object} arg 其他参数
 */
export const client_saveDraftBox = (mobile, arg) => {
    let defa = {
        mobile,
    }
    let opts = $.extend({}, defa, arg);
    console.log(opts)
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.saveDraftBox,
            data: opts,
            success: function (data) {
                resultHandled(resolve, data, data);
            }
        });
    });
}


/**
 * 获取汽车品牌列表
 */
export const client_getCarBrandList = function () {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.carbrand,
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        });
    });
}

/**
 * 获取汽车车型
 * @param {Number} brandCode 汽车品牌编码
 */
export const client_getCarModelList = (brandCode) => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.carmodel,
            data: {
                brandCode: brandCode,
            },
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        });
    });
}


/**
 * 获取车牌前缀列表
 */
export const client_getLpprefixList = () => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.lpprefix,
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        });
    });
}

/**
 * 获得城市列表
 */
export const client_cityList = () => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.city,
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}


/**
 * 获取城区列表
 * @param {Number} 城市代码
 */
export const client_districtsList = cityCode => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.district,
            data: {
                cityCode,
            },
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}


/**
 * 获取服务商列表
 * @param {Number} 城市代码
 */
export const client_providerList = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.providerList,
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}

/**
 * 发送验证码
 * @param {Number} mobile 手机号码
 */
export const client_getVcode = mobile => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.vcode,
            data: {
                mobile: mobile
            },
            success: data => {

                resultHandled(resolve, data, data);
            }
        })
    });
}


/**
 * 注册账号
 * @param {Object} arg 注册信息
 */
export const client_register = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.register,
            data: arg,
            type: 'post',
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}

export const client_wxbingd = () => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.wxbingd,
            success: data => {
                resolve(data);
            }
        })
    });
}

/**
 * 创建支付事务订单，由客户端在调用微信支付接口之前调用。
 * 用户必须是在【待支付】情况才能调用此接口
 */


export const client_unifiedorder = () => {
    return new Promise((resolve, reject) => {
        base({
            url: clientApi.unifiedorder,
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}
export const server_login = (mobile, passowrd) => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.login,
            data: {
                name: mobile,
                pwd: passowrd
            },
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}

/**
 * 获得服务商的个人信息
 */
export const server_myInfo = () => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.myInfo,
            success: data => {
                console.log('获得服务商的个人信息')
                resultHandled(resolve, data, data.data);
            }
        })
    });
}


export const server_osummary = () => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.osummary,
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}


export const server_ysummary = () => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.ysummary,
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}

/**
 * 获取订单列表
 * @param {Object} arg 参数
 */
export const server_ypage = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.ypage,
            data: arg,
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}


/**
 * 获取订单列表  opage只是查订单状态
 * 10 = 服务中
 * 11 = 服务完成
 * @param {Object} arg 参数
 */
export const server_opage = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.opage,
            data: arg,
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}

/**
 * 获取订单详情   
 * @param {Number} orderId 订单ID
 */
export const server_OrderDetail = orderId => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.detail,
            data: {
                orderId,
            },
            success: data => {
                resultHandled(resolve, data, data.data);
            }
        })
    });
}


/**
 * 订单操作，确认或者拒绝
 * @param {Object} arg 订单操作
 */
export const server_confirm = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.confirm,
            data: arg,
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}


/**
 * 提交服务码
 * @param {Object} arg 参数
 */
export const server_servicing = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.servicing,
            data: arg,
            type: 'post',
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}

/**
 * 提交报价单
 * @param {Object} arg 参数
 */
export const server_pricesheet = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.pricesheet,
            data: arg,
            type: 'post',
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}


/**
 * 服务完成
 * @param {Object} arg 参数
 */
export const server_finish = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: serverApi.finish,
            data: arg,
            type: 'post',
            success: data => {
                resultHandled(resolve, data, data);
            }
        })
    });
}