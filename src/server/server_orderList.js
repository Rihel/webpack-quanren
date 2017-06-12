import '../scss/server.scss';
import '../scss/font.scss';
import './menu_toggle';

import {
    alert,
    dialog,
    reloadDialog,
    jumpPage
} from '../modules/dialog';
import tem from '../modules/template-web'
import {
    server_ypage,
    server_OrderDetail,
    server_confirm,
    server_servicing,
    server_opage,
    server_pricesheet
} from '../api/api';
import {
    uploadImages,
    uploadTypes,
    alias
} from '../modules/uploadOssAll';

import until from '../modules/until';
let statu = Number(window.location.hash.substr(1)) || 1;

// alert(1);
// async function getData(queryType) {
//     let data = await server_ypage({ queryType });
//     console.log(data);
//     return data.dataLst ? data.dataLst : [];
// }
$('#carBrandCode').attr('code', statu).html(until.getStatusCodeString(statu))
renderOrder(statu);

// setInterval(function() { renderOrder(statu) }, 5000);
$('.searchBtn').on('click', function () {
    let text = $('.search').val();
    if (until.isEmpty(text)) {
        alert('搜索内容不能为空');
        return;
    }
    renderOrder(0, text);
})

$('.status-slider li').on('click', function () {
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

            btnsCallback = function (btns) {
                $(btns[0]).on('click', async function () {
                    let data = await server_confirm({
                        orderId: orderId
                    });
                    if (data.success) {
                        reloadDialog('预约成功')
                    }
                })
                $(btns[1]).on('click', function () {
                    reject(orderId);
                })
            }
        }
        if (statusCode === 4) {
            btns.unshift('输入服务码');
            btnsCallback = function (btns) {
                $(btns).on('click', function () {
                    inputServiceNo(orderId);
                })
            }
        }
        if (statusCode === 5) {
            btns.unshift('上传维修报价单');
            btnsCallback = function (btns) {
                $(btns).on('click', function () {
                    pricesheet(orderId, detail);
                })
            }
        }
        if (statusCode === 10) {
            btns.unshift('服务完成，上传结算单');
            btnsCallback = function (btns) {
                $(btns[0]).on('click', function () {
                    until.jumpPage('upload', {
                        orderId
                    });
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
                        btnsCallback: function (btns) {
                            $(btns).on('click', function () {
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


            $(btns[0]).on('click', async function () {

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




function pricesheet(orderId, order) {
    // console.log(arguments)
    dialog({
        title: '维修报价单',
        content: `
                <dl class="dl-horizontal">
                    <dt style="text-align:left;">订单号:</dt>
                    <dd style="margin:0;">${order.orderId}</dd>
                      <dt style="text-align:left;">车牌:</dt>
                    <dd style="margin:0;">${order.licensePlateNumber}</dd>
                      <dt style="text-align:left;">车型:</dt>
                    <dd style="margin:0;">${order.carModelTitle}</dd>
                      <dt style="text-align:left;">维修开始时间:</dt>
                    <dd style="margin:0;">${order.reservedTime}</dd>
                </dl>
                 <div class="form-box  image-box" style="display:block;">
                        <div class="image-warpper" style="display:block;">
                            <div class="warpper" style="width:100%;">
                                <h5>请对维修报价单拍照</h5>
                                <div class="image-file" style="width:100%;">
                                    <img src="" id="repair_price_sheet_image" alt="">
                                    <input class="file" id="repair_price_sheet" uploadType="repair_price_sheet" type="file">
                                    <div class="progress-warpper">
                                        <div class="progress"></div>
                                        <div class="progress-text">
                                            正在上传中...
                                        </div>
                                    </div>
                                     <span>上传图片</span>
                                </div>
                            </div>
                        </div>
                    </div>
                      <textarea id="pricesheetremark" placeholder="备注信息...." style="width:100%;height:10rem;"></textarea>
                            `,
        btns: ['提交报价单', '返回'],

        init: function (btns) {
            let submitJson = {};
            submitJson.orderId = orderId;
            let repair_price_sheet = uploadImages($('#repair_price_sheet')[0], null, 'repair_price_sheet');
            repair_price_sheet.bind('PostInit', function () {
               

                $('#repair_price_sheet').on('change', function (e) {
                    let file = e.target.files[0];
                    let postfix = /\.[^\.]+$/.exec(file.name);
                    if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
                        alert('这个不是图片哟,重新上传吧');
                        return;
                    }
                    let dataUrl = window.URL.createObjectURL(file);
                    let key = $(this).attr('uploadType');
                    $(this).prev().attr('src', dataUrl);
                    repair_price_sheet.addFile(file);
                    submitJson.priceSheetUrl = `dev/${until.getItem('providerId')}_${order.orderId}_${key}${postfix}`;
                    console.log(submitJson, 'file');
                });
                $('input[id^="html5"]').on('change', function (e) {
                    let key = $(this).parent().prevAll('.file').attr('uploadType');
                    let file = repair_price_sheet.files[0];
                    let postfix = /\.[^\.]+$/.exec(file.name);
                    if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
                        alert('这个不是图片哟,重新上传吧');
                        return;
                    }
                    submitJson.priceSheetUrl = `dev/${until.getItem('providerId')}_${order.orderId}_${key}${postfix}`;
                    console.log(submitJson, 'html5');
                })

            })

            $('#pricesheetremark').on('input', function () {
                submitJson.remark = $(this).val();
                console.log(submitJson);
            })



            $(btns[0]).on('click', async function () {
                uploadTypes['uploadrepair_price_sheet'](repair_price_sheet, `${until.getItem('providerId')}_${order.orderId}`)
                console.log(submitJson)
                let data = await server_pricesheet(submitJson);
                if (data.success) {
                    jumpPage('提交成功！', 'index');
                }
            })
        }
    })

}


async function renderOrder(statusCode, text) {
    let data;
    if (Number(statusCode) === 10 || Number(statusCode) === 11 || Number(statusCode) === 6) {
        // console.log(statusCode);
        data = await server_opage({
            queryType: statusCode
        });
    } else {
        data = await server_ypage({
            queryType: statusCode
        });
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