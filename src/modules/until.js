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