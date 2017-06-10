import tem from '../modules/template-web';

class Until {
    constructor() {
        /**
         * 本地数据的前缀
         */
        this.baseName = 'QUANREN_';
    }

    /**
     * 获取本地数据
     * @param {String} key 数据的Key
     * @return 返回值
     */
    getItem(key) {
        return JSON.parse(window.localStorage.getItem(this.baseName + key));
    }

    /**
     * 
     * @param {String} key 数据的Key
     * @param {any} value  数据的值
     */
    setItem(key, value) {
        window.localStorage.setItem(this.baseName + key, JSON.stringify(value));
    }

    /**
     * 删除本地数据
     * @param {String} key 数据的Key
     */
    removeItem(key) {
        window.localStorage.removeItem(this.baseName + key);
    }

    /**
     * 数据是否为空
     * @param {String} value 数据 
     */
    isEmpty(value) {
        return (value === null || value === undefined || value === '') ? true : false;
    }

    /**
     * 数据是否为手机号码
     * @param {String} value 数据 
     */
    isPhone(value) {
        if (this.isEmpty(value)) {
            return;
        }
        if (value.length === 11) {
            return /^1[358]\d{9}/g.test(value) ? true : false;
        } else {
            return false;
        }
    }

    urlParams() {
        let url = location.search; //获取url中"?"符后的字串 
        let theRequest = new Object();
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    /**
     * 数据是否为身份证
     * @param {String} value 数据 
     */
    isIdCard(value) {
        if (this.isEmpty(value)) {
            return;
        }
        if (value.length === 18 || value.length === 15) {
            return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/g.test(value) ? true : false;
        } else {
            return false;
        }
    }

    /**
     * 数据是否为车牌号码
     * @param {String} value 数据 
     */
    isVehicleNumber(vehicleNumber) {
        var result = false;
        if (vehicleNumber.length == 7) {
            var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
            result = express.test(vehicleNumber);
        }
        return result;
    }

    /**
     * 跳转页面
     * @param {String} name 跳转页面名
     * @param {Object} data 参数
     */
    jumpPage(name, data) {
        var href = name.concat('.html');
        if (data) {
            href = href + '?' + $.param(data);
        }
        window.location.href = href;
    }

    /**
     * 插入加载效果
     * @param {String} text 文本
     */
    loading(text) {
        let loading = $('<div class="loading">'),
            roll = $('<div><i class="fa fa-spin fa-circle-o-notch"></div>'),
            content = $('<div>' + text + '</div>');
        loading.append(roll).append(content);
        $('body').append(loading);
    }

    /**
     * 删除加载效果
     */
    closeLoading() {
        $('body .loading').remove();
    }

    /**
     * 再次封装模板引擎
     * @param {String} domId 渲染挂载的DomId
     * @param {String} templateId 模板Id
     * @param {Object} data 渲染数据
     * @param {boolean} isAppend 是否添加
     */
    renderTem(domId, templateId, data, isAppend = false) {
        isAppend ? $(`#${domId}`).append(tem(templateId, data)) : $(`#${domId}`).html(tem(templateId, data));
    }


    isWechat() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }
    format(fmt) { //author: meizz 
        var date = new Date();
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    getStatusCodeString(statusCode) {
        var statusLbl = '';
        switch (Number(statusCode)) {
            case 1:
                statusLbl = '等待确认';
                break;
            case 2:
                statusLbl = '预约已确认';
                break;
            case 3:
                statusLbl = '预约拒绝';
                break;
            case 4:
                statusLbl = '等待服务';
                break;
            case 5:
                statusLbl = '等待报价单';
                break;
            case 6:
                statusLbl = '报价单审核中 ';
                break;
            case 7:
                statusLbl = '报价单审核通过';
                break;
            case 8:
                statusLbl = '报价单审核不通过';
                break;
            case 9:
                statusLbl = '超时锁定';
                break;
            case 10:
                statusLbl = '服务中';
                break;
            case 11:
                statusLbl = '服务完成';
                break;
            case 12:
                statusLbl = '已取消';
                break;
            default:
                statusLbl = '无效状态:' + statusCode.toString();
                break;
        }
        console.log(statusLbl)
        return statusLbl;
    }

    GetOrderServiceLabel(OrderData) {
        var service_label = '';
        if (OrderData['washCode'] == 1 || OrderData['washService'] == 1) {
            service_label = "普洗";
        } else if (OrderData['washCode'] == 2 || OrderData['washService'] == 2) {
            service_label = "精洗";
        } else if (OrderData['needRepair'] == true || OrderData['repair'] == true) {
            service_label = "维修";
        } else if (OrderData['needMaintenance'] == true || OrderData['maintenance'] == true) {
            service_label = "保养";
        } else {
            service_label = "未知服务类型";
        }
        return service_label;
    }
}

export default new Until();