import {
    api,
    userStatus
} from './apiUrls';
import until from '../modules/until';

/**
 * 
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
                until.closeLoading();
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
export const userGet = arg => {
    return new Promise((resolve, reject) => {
        base({
            url: api.userGet,
            type: 'get',
            data: arg,
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
export const getDraftBox = mobile => {
    base({
        url: api.getDraftBox,
        data: {
            mobile: mobile
        },
        success: function(data) {
            if (data.success) {
                resolve(data.data);
            }
        }
    });
}

export const carBrandList = function() {
    base({
        url: api.carbrand,
        success: data => {
            if (data.success) {
                resolve(dtaa.data);
            }
        }
    });
}