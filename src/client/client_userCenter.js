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
    client_orderGetServiceno
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
    $('.goUserCenter').on('click', function(params) {
        $('.my-order').fadeOut();
    })
    $('.order-list-warpper li').on('click', function() {
        // console.log($(this).attr('orderId'))
        let order = orders.dataLst.filter(item => {
            return item.orderId == $(this).attr('orderId');
        })


        console.log(order);
        until.renderTem('trans', 'order-detail-tem', {
            order: order[0]
        });
        $('.trans').fadeIn();
        $('.goBack').on('click', function() {
            $('#trans').fadeOut();
        });
        $('.daodian').on('click', function() {
            $(this).hide();
            $('.serviceno').show();
        });
        $('.cancel').on('click', function() {
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
                btnsCallback: function(btns) {
                    $(btns[0]).on('click', async function() {
                        console.log(order.orderId)
                        let result = await client_orderCancel(order[0].orderId, $('#reason').val());
                        if (result.success) {
                            jumpPage('取消成功！', 'userCenter');
                        }
                    })
                }
            })
        });


        $('.serviceno').on('click', async function() {
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
    $('#carMileage').on('change', function() {

        $('.updateCarMileage').removeAttr('disabled');

    })
    $('.closeUserInfo').on('click', function() {
        $('.user-info').fadeOut();
    })
}

$(function() {
    $('.user-controls li').on('click', function(e) {
        $(`.${$(this).attr('show')}`).fadeIn();
        if ($(this).hasClass('layter')) {
            initOrderList('layter');
        }
        if ($(this).hasClass('jilu')) {
            initOrderList('jilu');
        }
    })
    initUserInfo();
    // initOrderList();
})