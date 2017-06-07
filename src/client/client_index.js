import '../scss/common.scss';
import '../scss/font.scss'
import '../scss/client.scss';


import tem from '../modules/template-web';
import until from '../modules/until';

import { alert, dialog } from '../modules/dialog';


import {
    client_userGet,
    client_cityList,
    client_districtsList,
    client_providerList,
    client_orderPage,
    client_orderSubmit
} from '../api/api';


let orderJson = {
    orderTypeCode: 1,
    washCode: null,
    providerId: null,
    orderTime: null
}


tem.defaults.imports.washServiceLabel = OrderData => {
    return until.GetOrderServiceLabel(OrderData)
}
tem.defaults.imports.OrderStatus = statusCode => {
    return until.getStatusCodeString(statusCode);
}
$('.drop').click(e => {
    let target = e.target,
        tagname = target.nodeName.toLowerCase();
    if (tagname === 'h3') {
        // $('#msform').find('.drop-menu').not($(this).next()).slideUp();
        $(e.target).toggleClass('active');
        $(e.target).next().slideToggle();

    }
    if (tagname === 'li') {
        let code = $(target).attr('code'),
            text = $(target).text(),
            dropMenu = $(target).parent(),
            title = dropMenu.prev();
        dropMenu.slideUp();
        title.text(text).attr('code', code);
        title.toggleClass('active')

    }

});



async function renderCity() {
    let citys = await client_cityList();
    until.renderTem('citys-list-warpper', 'city-tem', {
        citys
    })
    $('#citys-list-warpper').find('li').on('click', function() {
        renderDistrict($(this).attr('code'));
    })
}

async function renderDistrict(code) {
    let districts = await client_districtsList(code);

    until.renderTem('district-warpper', 'district-tem', {
        districts: districts !== undefined ? districts : [{
            title: '暂时没有数据'
        }],
    });
    renderProviders(code, districts[0].districtCode);
    console.log(districts[0])
        // var districtWarpper = new IScroll(document.querySelector('.district-list'));
    $('#district-warpper').find('li').on('click', function() {
        $('#district-warpper').find('li').removeClass('active');
        renderProviders(code, $(this).attr('code'));
        $(this).addClass('active')
    })
}

async function renderProviders(cityCode = 1, districtCode = 1) {
    let providers = await client_providerList();
    until.renderTem('shop-list-warpper', 'shop-list-tem', {
        providers: providers.filter(item => {
            return item.cityCode == cityCode && item.districtCode == districtCode;
        }),
    });
    // var shopList = new IScroll('#shop-list');
    $('#shop-list-warpper .list-item').on('click', function() {
        $('#shop-list-warpper .list-item').removeClass('active');
        orderJson['providerId'] = Number($(this).attr('providerId'));
        orderJson['shopName'] = $(this).attr('shopName')
        orderJson['detailAddr'] = $(this).attr('detailAddr');
        $(this).addClass('active');
        console.log(orderJson);
    })
}

function chageOrderTime(date, time) {
    orderJson.orderTime = `${date} ${time}`;
}
(async function() {


    let latelys = await client_orderPage({
        statusCode: 2
    });
    let date = until.format('yyyy-MM-dd');
    let time = `${new Date().getHours() > 19 ? 9 : new Date().getHours()}:00`;
    $('.orderDate').val(date)
        // console.log(latelys.dataLst)
    until.renderTem('lately-warpper', 'lately-tem', {
        latelys: latelys.dataLst
    })
    renderCity();
    renderDistrict(1);
    renderProviders();
    chageOrderTime(date, time)

    console.log(orderJson);
    /**
     * 初始化时间
     */
    let times = [];
    for (let i = 9; i <= 19; i++) {
        if (i < 10) {
            times.push(`0${i}:00`, `0${i}:30`);
        } else {
            times.push(`${i}:00`, `${i}:30`);
        }
    }
    until.renderTem('times', 'times-tem', { times, now: time });



    $('.times li').on('click', function() {
        time = $(this).attr('code');
        orderJson['orderTypeCode'] = Number($(this).attr('orderTypeCode'))
        chageOrderTime(date, time);
        console.log(orderJson);
    });

    $('.orderDate').on('change', function() {
        date = $(this).val();
        orderJson['orderTypeCode'] = Number($(this).attr('orderTypeCode'))
        chageOrderTime(date, time);
        console.log(orderJson);
    })

    $('.instant-services').click(function() {
        if ($(this).hasClass('btn-default')) {
            $(this).removeClass('btn-default').addClass('btn-primary');
            orderJson['orderTypeCode'] = Number($(this).attr('orderTypeCode'))
            console.log(orderJson);
        } else {
            $(this).removeClass('btn-primary').addClass('btn-default');
            orderJson['orderTypeCode'] = 1
            console.log(orderJson);
        }
    })

    /**
     * 选择服务，改变json
     */
    $('.servers li').on('click', function() {
        $('.order-warpper').fadeIn();
        let type = $(this).attr('type');

        if (type === 'wash') {
            $('.washType').show();
            orderJson['washCode'] = 1;
        }
        if (type === 'needMaintenance') {
            orderJson['needMaintenance'] = true;
        }
        if (type === 'needRepair') {
            orderJson['needRepair'] = true;
        }
        console.log(orderJson);
    });

    /**
     * 返回首页，清除预约数据
     */
    $('.goback').click(function() {
        $('.order-warpper').fadeOut();
        $('.washType').hide();
        orderJson = {};
        console.log(orderJson);
    });




    $('.ordernext').click(function() {

        if (until.isEmpty($('.orderDate').val())) {
            alert('请输入日期')
            return;
        }

        $('.order-time').fadeOut(function() {
            $('.order-pro').fadeIn();
        });

    });
    $('.backTime').click(function() {
        $('.order-pro').fadeOut(function() {
            $('.order-time').fadeIn();
        });
    })

    $('.next').click(function() {
        if (until.isEmpty(orderJson['providerId'])) {
            alert('请选择门店');
            return;
        }

        $('.order-pro').fadeOut(function() {
            $('.order-sure').fadeIn(function() {
                until.renderTem('sure', 'sure-tem', { orderJson })
            });
        });
    });


    $('.sure-goback').on('click', function() {
        $('.order-item').fadeOut().parent().fadeOut().find('.order-time').fadeIn();
    });
    $('.washType li').on('click', function(e) {
        $('.washType li').removeClass('active');
        $(this).addClass('active');
        orderJson.washCode = Number($(this).attr('washCode'));
        console.log(orderJson);
    });

    $('.backOrderPro').on('click', function(e) {

    })
    $('.submit-order').on('click', async function(e) {
        let isOrder = false;
        let orders = await client_orderPage({
            startTime: date,
            endTime: date
        });

        if (orders.dataLst) {
            for (let i = 0; i < orders.dataLst.length; i++) {
                console.log(orders.dataLst.statusCode)
                if (orders.dataLst[i].statusCode == 1) {
                    isOrder = false;
                    break;
                } else {
                    isOrder = true;

                }
            }
        } else {
            isOrder = false;
        }

        if (isOrder) {
            let result = await client_orderSubmit(orderJson);
            if (result.success) {
                dialog({
                    title: '温馨提醒',
                    content: '预约成功，返回首页',
                    btns: ['确定'],
                    btnsCallback: function(btns) {
                        $(btns).on('click', function() {
                            until.jumpPage('index');
                        })
                    }
                })
            }
        } else {
            dialog({
                title: '温馨提醒',
                content: '今天已有预约,返回首页',
                btns: ['确定'],
                btnsCallback: function(btns) {
                    $(btns).on('click', function() {
                        until.jumpPage('index');
                    })
                }
            })
        }

    })
})();