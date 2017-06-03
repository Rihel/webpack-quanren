import '../scss/server.scss';
import '../scss/font.scss';
import './menu_toggle';

import { alert } from '../modules/dialog';
import {
    server_ypage
} from '../api/api';
import until from '../modules/until';
let statu = Number(window.location.hash.substr(1)) || 1;

alert(1);
// async function getData(queryType) {
//     let data = await server_ypage({ queryType });
//     console.log(data);
//     return data.dataLst ? data.dataLst : [];
// }

renderOrder(statu);

async function renderOrder(statusCode) {
    let data = await server_ypage({ queryType: statusCode });
    let orders = data.dataLst ? data.dataLst : [];
    let text = GetBookingOrderStatusLabel(statusCode);
    until.renderTem('order', 'order-tem', {
        orders
    })
}

/* 获取用户预约订单的状态标签 */
function GetBookingOrderStatusLabel(statusCode) {
    var statusLbl = '';
    switch (statusCode.toString()) {
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