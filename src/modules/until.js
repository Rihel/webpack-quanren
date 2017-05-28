class Until {
    constructor() {
        this.baseName = 'QUANREN_';
    }

    getItem(key) {
        return JSON.parse(window.localStorage.getItem(this.baseName + key));
    }
    setItem(key, value) {
        window.localStorage.setItem(this.baseName + key, JSON.stringify(value));
    }
    removeItem(key) {
        window.localStorage.removeItem(this.baseName + key);
    }
    isEmpty(value) {
        return (value === null || value === undefined || value === '') ? true : false;
    }
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
    isVehicleNumber(vehicleNumber) {
        var result = false;
        if (vehicleNumber.length == 7) {
            var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
            result = express.test(vehicleNumber);
        }
        return result;
    }
    jumpPage(name, data) {
        var href = name.concat('.html');
        if (data) {
            href = href + '?' + $.param(data);
        }
        window.location.href = href;
    }
    loading(text) {
        var loading = $('<div class="loading">');
        var roll = $('<div><i class="fa fa-spin fa-circle-o-notch"></div>');
        var text = $('<div>' + text + '</div>')
        loading.append(roll).append(text);
        $('body').append(loading);
    }
    closeLoading() {
        $('body .loading').remove();
    }

}

export default new Until();