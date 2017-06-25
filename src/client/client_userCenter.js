import '../scss/common.scss';
import '../scss/font.scss'
import '../scss/client.scss';

import until from '../modules/until';
import tem from '../modules/template-web';
import {
    dialog,
    alert,
    jumpPage
} from '../modules/dialog';
import {
    client_userGet,
    client_orderPage,
    client_orderCancel,
    client_orderGetServiceno,
    client_passwdReset,
} from '../api/api.js'


tem.defaults.imports.OrderStatus = statusCode => {
    return until.getStatusCodeString(statusCode);
}
tem.defaults.imports.washServiceLabel = OrderData => {
    return until.GetOrderServiceLabel(OrderData)
}
tem.defaults.imports.getClitypeLabel = vipLevelCode => {
    console.log(vipLevelCode);
    return until.getClitype(vipLevelCode)
}
async function initOrderList(type) {
    let orders = await client_orderPage();


    console.log(orders, '用户数据。。。')
    let finishOrders = [];
    console.log(orders.dataLst)
    if (orders.dataLst) {
        if (type == 'layter') {
            finishOrders = orders.dataLst.filter(item => {
                let code = item.statusCode;
                return code <= 10;
            })
            console.log(orders)
        } else if (type == 'jilu') {
            finishOrders = orders.dataLst.filter(item => {
                let code = item.statusCode;
                return code == 11 || code == 9;
            })
        }
    }
    until.renderTem('my-order-warpper', 'order-tem', {
        orders: finishOrders
    });
    $('.goUserCenter').on('click', function (params) {
        $('.my-order').fadeOut();
    })
    $('.order-list-warpper li').on('click', function () {
        // console.log($(this).attr('orderId'))
        let order = orders.dataLst.filter(item => {
            return item.orderId == $(this).attr('orderId');
        })


        console.log(order);
        until.renderTem('trans', 'order-detail-tem', {
            order: order[0]
        });
        $('.trans').fadeIn();
        $('.goBack').on('click', function () {
            $('#trans').fadeOut();
        });
        $('.daodian').on('click', function () {
            $(this).hide();
            $('.serviceno').show();
        });
        $('.cancel').on('click', function () {
            dialog({
                content: `
                    <p>确定取消预约吗？</p>
                    <select id="reason" value="我想换个时间" style="width:100%;height:30px;">
                        <option value="我想换个时间">我想换个时间</option>
                        <option value="我不需要这个服务了">我不需要这个服务了</option>
                        <option value="其他原因">其他原因</option>
                    </select>
                `,
                btns: ['确定取消', '返回'],
                btnsCallback: function (btns) {
                    $(btns[0]).on('click', async function () {
                        console.log(order.orderId)
                        let result = await client_orderCancel(order[0].orderId, $('#reason').val());
                        if (result.success) {
                            jumpPage('取消成功！', 'userCenter');
                        }
                    })
                }
            })
        });


        $('.serviceno').on('click', async function () {
            let result = await client_orderGetServiceno(order[0].orderId)
            jumpPage(`服务码为${result.data.serviceNo}`, 'userCenter')
        })
    })


}
async function initUserInfo() {
    let userData = await client_userGet();
    $('.user-name').html(userData.data.name);
    until.renderTem('user-info', 'user-info-tem', {
        userInfo: userData.data
    });

    $('#carMileage').val(userData.data.carMileage);
    $('#carMileage').on('change', function () {

        $('.updateCarMileage').removeAttr('disabled');

    })
    $('.closeUserInfo').on('click', function () {
        $('.user-info').fadeOut();
    })
}

async function initResetPwd() {
    let resetPwd = $('.reset-pwd');
    resetPwd.on('click', function () {
        dialog({
            title: '重置密码',
            content: `
            <div class="form-box ">
                    <div class="form-item">
                        <i>旧密码</i>
                        <input class="mobile" id="oldPasswd" type="number" pattern="[0-9]*" placeholder="请输入旧密码">
                    </div>
                    <div class="form-item">
                        <i>新密码</i>
                        <input class="name" id="newPasswd" type="text" placeholder="请输入新密码">
                    </div>
                </div>
            `,
            close: false,
            btns: ['确定', '取消'],
            init: function (btns, self) {
                $(btns[1]).on('click', function () {
                    self.close();
                });
                let oldPasswd = $('#oldPasswd'),
                    newPasswd = $('#newPasswd');
                const vis1 = () => {
                    if (until.isEmpty(oldPasswd.val())) {
                        alert('旧密码不能为空');
                        return;
                    }
                    if (until.isEmpty(newPasswd.val())) {
                        alert('新密码不能为空');
                        return;
                    }
                    return true;
                }
                $(btns[0]).on('click', async function () {
                    if (vis1()) {
                        let result = await client_passwdReset(oldPasswd.val(), newPasswd.val());
                        if (result.success) {
                            jumpPage('重置密码成功', 'userCenter')
                        }
                    }
                })

            }
        })

    })
}

$(function () {
    $('.user-controls li').on('click', function (e) {
        $(`.${$(this).attr('show')}`).fadeIn();
        if ($(this).hasClass('layter')) {
            initOrderList('layter');
        }
        if ($(this).hasClass('jilu')) {
            initOrderList('jilu');
        }
    })
    initUserInfo();
    initResetPwd()
    // initOrderList();
})