/**
 * @description 弹窗组件
 * @constructor Dialog
 * @class Dialog
 */
import until from '../modules/until';
class Dialog {
    constructor(opt) {
        let defaults = {
            title: '错误',
            content: $('.dialog-template').html() || '',
            btnVal: '确定',
            close: true
        }
        this.setting = $.extend({}, defaults, opt);
        this.container = $('<div class=" dialog-container">');
        this.mark = $('<div class="dialog-mark">');
        this.box = $('<div class="dialog-box modal-content">');
        this.title = $('<div class="dialog-title modal-header">');
        this.titleText = $('<h4 class="modal-title"></h4>').html(this.setting.title)
        this.closeButton = $('<button type="button" class="close" ></button>')
        this.title.append(this.closeButton).append(this.titleText);

        this.closeButton.click(() => {
            self.close();
        })
        this.content = $('<div class="dialog-content modal-body">').html(this.setting.content);
        this.controls = $('<div class="dialog-controls modal-footer">');
        this.closeButton.on('click', e => this.close());
        this.start();
    }
    start() {
        let self = this;
        this.init();
        $('body').append(this.container);
        this.mark.fadeIn(300, function () {
            self.box.fadeIn(300, function () {
                console.log('初始化')
                self.setting.init && self.setting.init(self.controls.find('input'),self);
            });

        })
    }
    init() {
        let self = this;
        this.container.append(this.mark).append(this.box);
        console.log(this.container);
        this.box.append(this.title).append(this.content).append(this.controls);
        if (this.setting.btns) {
            $.each(this.setting.btns, function (index, item) {
                self.controls.append($('<input type="button" class="btn btn-primary"/>').val(item));
            });
        }
        let btns = this.controls.find('input');
        if (this.setting.close) {
            btns.on('click', function () {
                self.close();
            })
        }
        self.setting.btnsCallback && self.setting.btnsCallback(btns, self);

        this.mark.click(function () {
            self.close();
        })
    }
    close() {
        let self = this;
        this.box.fadeOut(300, function () {
            self.mark.fadeOut(300, function () {
                self.container.remove();
            });
        });
    }
}

/**
 * 美化原生alert
 * @param {String} content 内容
 */
export const alert = content => {
    return new Dialog({
        title: '错误',
        content,
        btns: ['确定'],
    })
};

/**
 * 导出组件，使起无new创建
 * @param {Object} opt 配置信息
 */
export const dialog = opt => {
    return new Dialog(opt);
}



export const jumpPage = (content, page) => {
    return new Dialog({
        title: '温馨提醒',
        content,
        btns: ['确定'],
        btnsCallback: function (btns) {
            $(btns).on('click', function () {
                until.jumpPage(page);
            })
        }
    })
}


export const reloadDialog = content => {
    dialog({
        title: '温馨提醒',
        content: content,
        btns: ['确定'],
        btnsCallback: function (btns) {
            $(btns).on('click', function () {
                window.location.reload();
            })
        }
    })
}