import '../scss/common.scss';
import '../scss/font.scss';
import '../scss/login.scss';


import {
    client_user_Status,
    client_login,
    client_getVcode,
    client_passwdForget
} from '../api/api';
import until from '../modules/until';
import {
    alert,
    dialog,
    jumpPage
} from '../modules/dialog';


/**
 * 获得节点
 */
let { log } = until;
let loginBox = $('.login');
let username = loginBox.find('#mobile');
let password = loginBox.find('#pwd');
username.val(until.getItem('mobile') || '');


/**
 * 手机号码校验
 */
username.on('change', function () {
    let name = username.val();
    if (!until.isPhone(name)) {
        $(this).addClass('active');
        $(this).next('.mesage').html('请输入正确的手机号码').show()
    } else {
        $(this).removeClass('active');
        $(this).next('.mesage').hide();
    }
})


/**
 * 登录操作
 */
$('.login-btn').on('click', function () {
    let name = username.val();
    let pwd = password.val();
    if (name === '' || pwd === '') {
        alert('用户名或者密码不能为空');
        return;
    }

    (async () => {

        let {
            status
        } = await client_user_Status(name);


        console.log(status);
        until.setItem('mobile', name);
        if (status <= 6) {
            statusHander(status, name);
        } else {
            try {
                let data = await client_login(name, pwd);
                if (status === 7) {
                    until.jumpPage('index', {
                        p: name
                    });

                }
                if (status === 9) {

                    until.jumpPage('wechat_pay');
                }
            } catch (e) {
                until.closeLoading();
                alert(e.errorDetail.msg);
            }

        }

    })();
})


/**
 * 忘记密码操作
 */
$('.forget-pwd').on('click', function (e) {
    e.preventDefault();
    dialog({
        title: '忘记密码',
        content: `
         <div class="form-box ">
                <div class="form-item">
                    <i>手机号码</i>
                    <input class="mobile" id="forgetMobile" type="number" pattern="[0-9]*" placeholder="请输入手机号码">
                </div>
                <div class="form-item">
                    <i>新密码</i>
                    <input class="name" id="newPasswd" type="text" placeholder="请输入新密码">
                </div>
                 <div class="form-item vcode-wrapper">
                    <i>验证码</i>
                    <input class="pwd vcode" id="vcode" type="text" placeholder="请输入验证码">
                    <input class="btn btn-primary vcode-btn" value="获取验证码" type="button" style="border:none;font-size:0.5rem;">
                </div>
            </div>
        `,
        close: false,
        btns: ['确定', '取消'],
        init: function (btns, self) {
            $(btns[1]).on('click', function () {
                self.close();
            });
            let forgetMobile = $('#forgetMobile'),
                newPasswd = $('#newPasswd'),
                vcode = $('#vcode'),
                vcodeBtn = $('.vcode-btn');

            const vis1 = () => {
                if (until.isEmpty(forgetMobile.val())) {
                    alert('手机号码不能为空');
                    return;
                }
                if (!until.isPhone(forgetMobile.val())) {
                    alert('请输入正确的手机号码');
                    return;
                }
                if (until.isEmpty(newPasswd.val())) {
                    alert('密码不能为空');
                    return;
                }
                return true;
            }
            vcodeBtn.on('click', async function () {

                /**
             * 获取验证码
             */
                if (vis1()) {
                    let verifyCode = await client_getVcode(forgetMobile.val());
                    console.log(verifyCode, '验证码')
                    if (verifyCode.success) {
                        vcodeBtn.prop('disabled', 'disabled');
                    } else {
                        alert('获取验证码太频繁了，稍等下吧~~');
                        return;
                    }

                    /**
                     * 获取验证码倒计时
                     */
                    let min = 30;
                    let timer = setInterval(function () {
                        if (min > 0) {
                            vcodeBtn.val(min + 's');
                            min--;
                        } else {
                            clearInterval(timer);
                            vcodeBtn.val('获取验证码');
                            vcodeBtn.removeProp('disabled');
                        }
                    }, 1000);
                }

            })
            $(btns[0]).on('click', async function () {
                if (vis1()) {

                    if (until.isEmpty(vcode.val())) {
                        alert('验证码不能为空');
                        return;
                    }

                    let result = await client_passwdForget(forgetMobile.val(), newPasswd.val(), vcode.val());
                    if (result.success) {
                        jumpPage('重置密码成功', 'login');
                    }

                }
            })

        }
    })
})

/**
 * 
 * 
 * @param {any} status 
 */


function statusHander(status, name) {
    console.log(`用户状态编码为${status}`)
    let message = [];
    message[0] = message[1] = message[2] = message[3] = '您的资料已经提交审核，请耐心等候. <p class="phone">24小时服务热线：<a href="tel:020-82455421" style="color:#f73859;">020-82455421</a></p>';
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
                        console.log(data, '参数')
                        until.jumpPage(jumpPage, data);
                    })
                }
            }
        })
    }
    let hander = {
        0() {
            tips(message[status])
        },
        1() {
            tips(message[status])
        },
        2() {
            tips(message[status], 'wait_pay')
        },
        3() {
            tips(message[status], 'wait_pay')
        },
        4() {
            tips(message[status], 'register', { mobile: name })
        },
        5() {
            tips(message[status], 'wechat_pay', {
                p: until.getItem('mobile')
            })
        },
        6() {
            tips(message[status])
        }

    }
    hander[status.toString()]();

}