import '../scss/server.scss';
import '../scss/font.scss';
import './menu_toggle';

import { alert, dialog } from '../modules/dialog';
import tem from '../modules/template-web'
import {
    server_ypage,
    server_OrderDetail,
    server_confirm
} from '../api/api';
import until from '../modules/until';
let statu = Number(window.location.hash.substr(1)) || 1;

// alert(1);
// async function getData(queryType) {
//     let data = await server_ypage({ queryType });
//     console.log(data);
//     return data.dataLst ? data.dataLst : [];
// }
$('#carBrandCode').attr('code', statu).html(getStatusCodeString(statu))
renderOrder(statu);

$('.status-slider li').on('click', function() {
    console.log(`查询的状态码为${Number($(this).attr('code'))}`)
    statu = Number($(this).attr('code'))
    renderOrder(statu)
})
tem.defaults.imports.washServiceLabel = OrderData => {
    return GetOrderServiceLabel(OrderData)
}
tem.defaults.imports.OrderStatus = statusCode => {
    return getStatusCodeString(statusCode);
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
        let finishData;
        let content;

        content = tem(`dialog-tem-default`, {
            detail
        });
        if (statu === 1) {

        } else {
            // dialog({
            //     title: '订单详情',
            //     content,
            //     btns: ['确定']
            // })
            content = tem(`dialog-tem-1`, {
                detail
            });
            dialog({
                title: '订单详情',
                content,
                btns: ['确认预约', '拒绝预约', '返回'],
                btnsCallback: function(btns) {

                    $(btns).eq(0).on('click', async e => {
                        let data = await server_confirm({
                            orderId,
                            resultCode: 2
                        });
                        alert('确认预约成功');
                        window.location.reload();
                    });
                    $(btns).eq(1).on('click', e => {
                        reject(orderId)
                    })
                }
            })
        }

    }
})

function reject(orderId) {
    dialog({
        title: '请输入取消原因',
        content: `
                             <div class="form-item">
                                <i>取消原因</i>
                                <input id="remark" type="text" placeholder="请输入取消原因">
                            </div>
                            `,
        btns: ['确定', '返回'],
        btnsCallback: btns => {
            $(btns).get(0).on('click', async e => {
                let data = await server_confirm({
                    orderId,
                    resultCode: 3,
                    remark: $('#remark').val()
                })
            })
        }
    })
}
async function renderOrder(statusCode) {
    let data = await server_ypage({ queryType: statusCode });
    let orders = data.dataLst ? data.dataLst : [];



    until.renderTem('order', 'order-tem', {
        orders
    })
}

function getStatusCodeString(statusCode) {
    var statusLbl = '';
    switch (Number(statusCode)) {
        case 1:
            statusLbl = '等待确认';
            break;
        case 2:
            statusLbl = '预约已确认';
            break;
        case 3:
            statusLbl = '预约拒绝';
            break;
        case 4:
            statusLbl = '等待服务';
            break;
        case 5:
            statusLbl = '等待报价单';
            break;
        case 6:
            statusLbl = '报价单审核中 ';
            break;
        case 7:
            statusLbl = '报价单审核通过';
            break;
        case 8:
            statusLbl = '报价单审核不通过';
            break;
        case 9:
            statusLbl = '超时锁定';
            break;
        case 10:
            statusLbl = '服务中';
            break;
        case 11:
            statusLbl = '服务完成';
            break;
        case 12:
            statusLbl = '已取消';
            break;
        default:
            statusLbl = '无效状态:' + statusCode.toString();
            break;
    }
    console.log(statusLbl)
    return statusLbl;
}

function GetOrderServiceLabel(OrderData) {
    var service_label = '';
    if (OrderData['washCode'] == 1 || OrderData['washService'] == 1) {
        service_label = "普洗";
    } else if (OrderData['washCode'] == 2 || OrderData['washService'] == 2) {
        service_label = "精洗";
    } else if (OrderData['needRepair'] == true || OrderData['repair'] == true) {
        service_label = "维修";
    } else if (OrderData['needMaintenance'] == true || OrderData['maintenance'] == true) {
        service_label = "保养";
    } else {
        service_label = "未知服务类型";
    }
    return service_label;
}