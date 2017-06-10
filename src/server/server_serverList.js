import '../scss/server.scss';
import '../scss/font.scss';
import './menu_toggle';

import { alert, dialog, reloadDialog } from '../modules/dialog';
import tem from '../modules/template-web'
import {
    server_ypage,
    server_OrderDetail,
    server_confirm,
    server_servicing,
    server_opage
} from '../api/api';
import until from '../modules/until';
let statu = Number(window.location.hash.substr(1)) || 1;

// alert(1);
// async function getData(queryType) {
//     let data = await server_ypage({ queryType });
//     console.log(data);
//     return data.dataLst ? data.dataLst : [];
// }
$('#carBrandCode').attr('code', statu).html(until.getStatusCodeString(statu))
renderOrder();

// setInterval(function() { renderOrder(statu) }, 5000);
$('.searchBtn').on('click', function() {
    let text = $('.search').val();
    if (until.isEmpty(text)) {
        alert('搜索内容不能为空');
        return;
    }
    renderOrder(0, text);
})


$('.status-slider li').on('click', function() {
    console.log(`查询的状态码为${Number($(this).attr('code'))}`)
    statu = Number($(this).attr('code'))
    renderOrder(statu)
})
tem.defaults.imports.washServiceLabel = OrderData => {
    return until.GetOrderServiceLabel(OrderData)
}
tem.defaults.imports.OrderStatus = statusCode => {
    return until.getStatusCodeString(statusCode);
}
tem.defaults.imports.time = time => {
    return /\d{4}-\d{2}-\d{2}/.exec(time)[0]
}
tem.defaults.imports.keyName = key => {
    let keyNameObj = {
        orderId: '订单号',
        statusCode: '订单状态',
        licensePlateNumber: '客户车牌',
        washService: '预约服务',
        // washCode: '预约服务',
        carModelTitle: '用户车型',
        createdTime: '预约时间',
        confirmedTime: '确认时间'
    }
    return keyNameObj[key];
}


$('#order').on('click', async e => {
    let target = e.target;

    if (target.nodeName.toLowerCase() === 'button') {
        let order = $(target).parent().parent();
        let orderId = order.attr('orderId');
        let detail = await server_OrderDetail(orderId);
        let statusCode = detail.statusCode;
        let finishData;
        let content;
        let btns = ['返回'];
        let btnsCallback;
        content = tem(`dialog-tem-default`, {
            detail
        });
        console.log(detail);
        if (statusCode === 1) {
            btns.unshift('拒绝预约');
            btns.unshift('确认预约');

            btnsCallback = function(btns) {
                $(btns[0]).on('click', async function() {
                    let data = await server_confirm({
                        orderId: orderId
                    });
                    if (data.success) {
                        reloadDialog('预约成功')
                    }
                })
                $(btns[1]).on('click', function() {
                    reject(orderId);
                })
            }
        }
        if (statusCode === 4) {
            btns.unshift('输入服务码');
            btnsCallback = function(btns) {
                $(btns).on('click', function() {
                    inputServiceNo(orderId);
                })
            }
        }
        if (statusCode === 10) {
            btns.unshift('服务完成，上传结算单');
            btnsCallback = function(btns) {
                $(btns[0]).on('click', function() {
                    until.jumpPage('upload', { orderId });
                })
            }
        }
        dialog({
            title: '订单详情',
            content,
            btns,
            btnsCallback,
        })
    }
})

function reject(orderId) {
    dialog({
        title: '请输入拒绝原因',
        content: `
                             <div class="form-item">
                                <i>拒绝原因</i>
                                <input id="remark" type="text" placeholder="请输入拒绝原因">
                            </div>
                            `,
        btns: ['确定', '返回'],
        btnsCallback: btns => {
            $(btns[0]).on('click', async e => {
                let data = await server_confirm({
                    orderId,
                    resultCode: 3,
                    remark: $('#remark').val()
                });
                console.log(data);
                if (data.success) {
                    dialog({
                        title: '温馨提醒',
                        content: '拒绝成功',
                        btns: ['确定'],
                        btnsCallback: function(btns) {
                            $(btns).on('click', function() {
                                window.location.reload();
                            })
                        }
                    })
                }
            })
        }
    })
}

function inputServiceNo(orderId) {
    dialog({
        title: '请输入服务码',
        content: `
                             <div class="form-item">
                                <i>服务码</i>
                                <input id="serviceNo" type="text" placeholder="请输入服务码">
                            </div>
                            `,
        btns: ['确定', '返回'],
        btnsCallback: btns => {


            $(btns[0]).on('click', async function() {

                console.log($('#serviceNo'), '提交服务码按钮');
                if (until.isEmpty($('#serviceNo').val())) {
                    alert('服务码不能为空');
                    return;
                }
                let data = await server_servicing({
                    orderId,
                    serviceNo: $('#serviceNo').val()
                });
                if (data.success) {
                    reloadDialog('输入成功，开始服务');
                }
            })
        }
    })
}



async function renderOrder(statusCode, text) {
    let data;
    if (Number(statusCode) === 10 || Number(statusCode) === 11 || Number(statusCode) === 6) {
        // console.log(statusCode);
        data = await server_opage({ queryType: statusCode });
    } else {
        data = await server_ypage({ queryType: statusCode });
    }
    let orders = data.dataLst ? data.dataLst : [];

    if (text) {
        let reg = new RegExp(text, 'g');
        console.log(reg);
        let finish = orders.filter(item => {
            if (item.licensePlateNumber) {
                console.log(item.licensePlateNumber, reg.test(tem.licensePlateNumber))
                return reg.test(item.licensePlateNumber);
            }

        });
        console.log(finish)
        until.renderTem('order', 'order-tem', {
            orders: finish
        })
    } else {
        until.renderTem('order', 'order-tem', {
            orders
        })
    }


}