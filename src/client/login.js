import '../scss/common.scss';
import '../scss/login.scss';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

import {
    user_Status,
    login
} from '../api/api';
import until from '../modules/until';
import {
    alert,
    dialog
} from '../modules/dialog';
let loginBox = $('.login-box');

let username = loginBox.find('#username');
let password = loginBox.find('#password');
username.val(until.getItem('mobile') || '');
console.log(until.getItem('mobile'));

username.trigger('change');
username.on('change', function () {
    let name = username.val();
    if (!until.isPhone(name)) {
        $(this).parent().addClass('has-error');
        $(this).next().addClass('fa-close');
        $(this).nextAll('.message').html('请输入正确的手机号码').css('color', '#a94442');
    } else {
        $(this).parent().removeClass('has-error').addClass('has-success');
        $(this).next().removeClass('fa-close').addClass('fa-check');
        $(this).nextAll('.message').html('');
        password.removeAttr('disabled');
        $('.login-btn').removeAttr('disabled');
    }
})



$('.login-btn').on('click', function () {
    let name = username.val();
    let pwd = password.val();
    if (name === '' || pwd === '') {
        alert('用户名或者密码不能为空');
        return;
    }

    (async() => {
        let {
            status
        } = await user_Status(name);
        until.setItem('mobile', name);
        console.log(status);
        if (status <= 6) {
            statusHander(status);
        } else {
            try {
                let data = await login(name, pwd);
                if (status === 7) {
                    until.jumpPage('index', {
                        p: name
                    });
                    if (status === 9) {
                        until.jumpPage('notify_bind_wx')
                    }
                }
            } catch (e) {
                console.log(e);
            }

        }

    })();
})

function tipAlert(title, msg) {
    dialog({
        title: title,
        content: msg,
        btns: ['确定']
    });
}

function statusHander(status) {
    let message = [];
    message[0] = message[1] = message[2] = message[3] = '您的资料已经提交初步审核，请耐心等候.';
    message[4] = '您的注册资料需要修改。';
    message[5] = '您的支付资料需要修改';
    message[6] = '用户已失效';

    function tips(mes, jumpPage, data) {
        let arg = arguments;
        dialog({
            title: '温馨提示',
            content: mes,
            btns: ['确定'],
            btnsCallback: btns => {
                if (arg.length > 1) {
                    $(btns).click(() => {
                        until.jumpPage(jumpPage, data);
                    })
                }
            }
        })
    }
    let hander = {
        0() {
            tips(message[status], 'notify_pre_validation01')
        },
        1() {
            tips(message[status], 'notify_pre_validation01')
        },
        2() {
            tips(message[status], 'notify_pre_validation01')
        },
        3() {
            tips(message[status], 'notify_pre_validation01')
        },
        4() {
            tips(message[status], 'notify_pre_validation02', {
                p: until.getItem('mobile')
            })
        },
        5() {
            tips(message[status], 'notify_pre_validation02', {
                p: until.getItem('mobile')
            })
        },
        6() {
            tips(message[status])
        }

    }
    hander[status.toString()];

}