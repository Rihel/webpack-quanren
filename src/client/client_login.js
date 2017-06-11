import '../scss/common.scss';
import '../scss/font.scss';
import '../scss/login.scss';


import {
    client_user_Status,
    client_login
} from '../api/api';
import until from '../modules/until';
import {
    alert,
    dialog
} from '../modules/dialog';


/**
 * 获得节点
 */
let loginBox = $('.login');
let username = loginBox.find('#mobile');
let password = loginBox.find('#pwd');
username.val(until.getItem('mobile') || '');


/**
 * 手机号码校验
 */
username.on('change', function() {
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
$('.login-btn').on('click', function() {
    let name = username.val();
    let pwd = password.val();
    if (name === '' || pwd === '') {
        alert('用户名或者密码不能为空');
        return;
    }

    (async() => {

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