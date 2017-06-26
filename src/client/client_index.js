import '../scss/common.scss';
import '../scss/font.scss'
import '../scss/client.scss';


import tem from '../modules/template-web';
import until from '../modules/until';

import {
    alert,
    dialog
} from '../modules/dialog';

import datePicker from '../modules/datePicker';


import {
    client_userGet,
    client_cityList,
    client_districtsList,
    client_providerList,
    client_orderPage,
    client_orderSubmit
} from '../api/api';
import moment from 'moment';

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

function changesTime(e) {
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

}
$('.drop').on('click', changesTime);



async function renderCity() {
    let citys = await client_cityList();
    let providers = await client_providerList();
    let finish = [];

    citys.forEach(item => {
        for (let i = 0; i < providers.length; i++) {
            let provide = providers[i];

            if (item.code == provide.cityCode) {
                finish.push(item);
                break;
            }
        }
    });
    console.log(finish, '最终完成');
    until.renderTem('citys-list-warpper', 'city-tem', {
        finish
    })
    $('#citys-list-warpper').find('li').on('click', function () {
        renderDistrict($(this).attr('code'));
    })
}

async function renderDistrict(code) {
    let districts = await client_districtsList(code);
    let providers = await client_providerList();
    console.log('渲染城区', districts, providers)

    let finish = [];

    districts.forEach(item => {
        for (let i = 0; i < providers.length; i++) {
            let provide = providers[i];

            if (item.code == provide.districtCode) {
                finish.push(item);
                break;
            }
        }
    });


    until.renderTem('district-warpper', 'district-tem', {
        districts: finish,
    });
    renderProviders(code, districts[0].districtCode);
    console.log(districts[0])
    // var districtWarpper = new IScroll(document.querySelector('.district-list'));
    $('#district-warpper').find('li').on('click', function () {
        $('#district-warpper').find('li').removeClass('active');
        renderProviders(code, $(this).attr('code'));
        $(this).addClass('active')
    })
}

async function renderProviders(cityCode = 1, districtCode = 1) {
    let providers = await client_providerList();
    until.renderTem('shop-list-warpper', 'shop-list-tem', {
        providers: providers ? providers.filter(item => {
            return item.cityCode == cityCode && item.districtCode == districtCode;
        }) : [],
    });
    // var shopList = new IScroll('#shop-list');
    $('#shop-list-warpper .list-item').on('click', function () {
        $('#shop-list-warpper .list-item').removeClass('active');
        orderJson['providerId'] = Number($(this).attr('providerId'));
        orderJson['shopName'] = $(this).attr('shopName')
        orderJson['detailAddr'] = $(this).attr('detailAddr');
        $(this).addClass('active');
        console.log(orderJson);
    })
}

function chageOrderTime(date, time) {
    console.log(date);
    orderJson.orderTime = `${date} ${time}`;
}
(async function () {


    let latelys = await client_orderPage({
        statusCode: 2
    });
    let date = until.format('yyyy-MM-dd', 1);
    let time = `${new Date().getHours() > 19 || new Date().getHours() < 19 ? 9 : new Date().getHours()}:00`;
    $('.orderDate').val(date)

    datePicker.init({
        trigger: '#orderDate',
        /*选择器，触发弹出插件*/
        'type': 'date',
        /*date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择*/
        'minDate': moment().add(1, 'd').format('YYYY-MM-DD'),
        /*最小日期*/
        'maxDate': moment().add(15, 'd').format('YYYY-MM-DD'),
        /*最大日期*/
        'onSubmit': function () { /*确认时触发事件*/
            var theSelectData = datePicker.value;
            date = theSelectData;
            chageOrderTime(theSelectData, time);
            orderJson['orderTypeCode'] = 1;
        },
        'onClose': function () { /*取消时触发事件*/ }
    })
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
    until.renderTem('times', 'times-tem', {
        times,
        now: time
    });



    $('.times li').on('click', function () {
        time = $(this).attr('code');
        orderJson['orderTypeCode'] = Number($(this).attr('orderTypeCode'))
        chageOrderTime(date, time);
        console.log(orderJson);
    });

    $('.orderDate').on('change', function () {
        date = $(this).val();
        orderJson['orderTypeCode'] = Number($(this).attr('orderTypeCode'))
        chageOrderTime(date, time);
        console.log(orderJson);
    })


    /**
     * 切换时预约还是即时服务
     */
    $('.instant-services').click(function () {
        if ($(this).hasClass('btn-default')) {
            $(this).removeClass('btn-default').addClass('btn-primary');
            orderJson['orderTypeCode'] = Number($(this).attr('orderTypeCode'))
            $('.orderDate').parent().hide();
            $('#times').parent().hide();


            orderJson['orderTime'] = '即时服务'
        } else {
            $(this).removeClass('btn-primary').addClass('btn-default');
            orderJson['orderTypeCode'] = 1
            $('#times').parent().show();
            $('.orderDate').parent().show();
            chageOrderTime(date, time)
        }
    })

    /**
     * 选择服务，改变json
     */
    $('.servers li').on('click', function () {
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
            $('#times').unbind('click', changesTime).on('click', changesTime);
            $('#times').css('background', '#fff');
            // $('.instant-services').hide();
        }
        console.log(orderJson);
    });





    $('.ordernext').click(function () {
        console.log($('.orderDate').val())
        if ($('.instant-services').hasClass('btn-primary')) {

            $('.order-time').fadeOut(function () {
                $('.order-pro').fadeIn();
            });
        } else {
            if (until.isEmpty($('.orderDate').val())) {
                alert('请输入日期')
                return;
            } else {
                if (Date.parse(orderJson.orderTime) < Date.now()) {
                    alert('亲~，你选的时间已经过去啦~重新选择下吧');
                    return;
                }
                $('.order-time').fadeOut(function () {
                    $('.order-pro').fadeIn();
                });
            }

        }
    });


    $('.next').click(function () {
        if (until.isEmpty(orderJson['providerId'])) {
            alert('请选择门店');
            return;
        }

        $('.order-pro').fadeOut(function () {
            $('.order-warpper').css('zIndex', 998);
            $('.nav-tab').removeClass('home');
            $('.order-sure').fadeIn(function () {
                until.renderTem('sure', 'sure-tem', {
                    orderJson
                })
            });
        });
    });


    $('.washType li').on('click', function (e) {
        $('.washType li').removeClass('active');
        $(this).addClass('active');
        orderJson.washCode = Number($(this).attr('washCode'));
        console.log(orderJson);
    });


    /**
     * 返回首页，清除预约数据
     */

    $('.goback').click(function () {
        $('.order-warpper').fadeOut();
        $('.washType').hide();
        orderJson = {};
        console.log(orderJson);
        $('.instant-services').show();
        orderDateIsInput()
        $('#times').parent().show();
        $('.orderDate').parent().show();
    });
    $('.backTime').click(function () {
        $('.order-pro').fadeOut(function () {
            $('.order-time').fadeIn();
        });
        $('.list-item').removeClass('active');
        orderDateIsInput()
        $('#times').parent().show();
        $('.orderDate').parent().show();
    })
    $('.backOrderPro').on('click', function (e) {
        $('.order-sure ').hide().prev().hide().prev().show();
        $('.list-item').removeClass('active');
        $('.order-warpper').css('zIndex', 1000).addClass('home');
        $('.instant-services').show()
        if (orderJson['needRepair']) {
            $('.instant-services').hide();

        }
        orderDateIsInput()
        $('#times').parent().show();
        $('.orderDate').parent().show();
    });

    $('.sure-goback').on('click', function () {
        $('.order-item').fadeOut().parent().fadeOut().find('.order-time').fadeIn();
        $('.order-warpper').css('zIndex', 1000).addClass('home');
        $('.list-item').removeClass('active');
        // orderJson = {};
        orderJson.washCode = 1;
        console.log('修改数据', orderJson, orderJson['needRepair'])
        $('.instant-services').show();

        $('#times').parent().show();
        $('.orderDate').parent().show();
        // orderDateIsInput()
    });

    $('.submit-order').on('click', async function (e) {
        let isOrder = false;
        let orders = await client_orderPage({
            startTime: date,
            endTime: date
        });
        console.log('获得的订单列表', orders);
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
            isOrder = true;
        }

        if (isOrder) {
            let result = await client_orderSubmit(orderJson);
            if (result.success) {
                dialog({
                    title: '温馨提醒',
                    content: '预约成功，返回首页',
                    btns: ['确定'],
                    btnsCallback: function (btns) {
                        $(btns).on('click', function () {
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
                btnsCallback: function (btns) {
                    $(btns).on('click', function () {
                        until.jumpPage('index');
                    })
                }
            })
        }

    });



    function orderDateIsInput() {
        console.log('重置成功')
        $('.orderDate').removeAttr('disabled').val('');
        $('#times').unbind('click', changesTime).on('click', changesTime);
        $('#times').css('background', '#fff');
        if ($('.instant-services').hasClass('btn-primary')) {
            $('.instant-services').removeClass('btn-primary').addClass('btn-default');
        } else {
            $('.instant-services').removeClass('btn-default').addClass('btn-default');
        }
    }

    function orderDateNoInput() {
        $('.orderDate').attr('disabled', 'disabled').val('');
        $('#times').unbind('click', changesTime).css('background', '#ebebe4');
    }
})();