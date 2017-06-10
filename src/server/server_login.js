import '../scss/common.scss';
import '../scss/font.scss';
import '../scss/login.scss';

import './menu_toggle';
import { alert, dialog } from '../modules/dialog';
import until from '../modules/until';
import {
    server_login
} from '../api/api.js'



$(function() {
    let name = $('#mobile').val(until.getItem('serverMobile')),
        pwd = $('#pwd');
    $('.login-btn').click(async function() {
        if (until.isEmpty(name.val().trim())) {
            alert('用户名不能为空!');
            return;
        }
        if (!until.isPhone(name.val().trim())) {
            alert('请输入正确的用户名');
            return;
        }
        if (until.isEmpty(pwd.val())) {
            alert('密码不能为空');
            return;
        }
        let data = await server_login(name.val(), pwd.val());

        if (data.success) {
            until.setItem('serverMobile', name.val());
            until.jumpPage('index', { p: name.val() });
        }
    })
})