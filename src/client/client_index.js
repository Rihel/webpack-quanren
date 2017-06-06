import '../scss/common.scss';
import '../scss/font.scss'
import '../scss/client.scss';


import tem from '../modules/template-web';
import until from '../modules/until';




import {
    client_userGet,
    client_cityList,
    client_districtsList,
    client_providerList,
    client_orderPage
} from '../api/api';
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
        districts: districts !== undefined ? districts : [{ title: '暂时没有数据' }],
    });
    renderProviders(code, districts[0].districtCode);
    console.log(districts[0])
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
}

(async function() {
    until.loading('正在加载中...')
    let latelys = await client_orderPage({
        statusCode: 2
    });
    until.closeLoading('正在加载中...')
    console.log(latelys.dataLst)
    until.renderTem('lately-warpper', 'lately-tem', {
        latelys: latelys.dataLst
    })
    renderCity();
    renderDistrict(1);
    renderProviders();

    $('.servers li').click(function() {
        $('.order-warpper').fadeIn();
    });
    $('.goback').click(function() {
        $('.order-warpper').fadeOut();
    })
    $('.ordernext').click(function() {
        $('.order-time').fadeOut(function() {
            $('.order-pro').fadeIn();
        });

    });
    $('.backTime').click(function() {
        $('.order-pro').fadeOut(function() {
            $('.order-time').fadeIn();
        });
    })
})();







var shopList = new IScroll('#shop-list');
var districtWarpper = new IScroll(document.querySelector('.district-list'));