import '../scss/common.scss';
import '../scss/register.scss';


import until from '../modules/until';
import tem from '../modules/template-web';
import { alert } from '../modules/dialog';
import {
    clitypes,
    getDraftBox,
    getCarBrandList,
    getCarModelList,
    saveDraftBox,
    getLpprefixList
} from '../api/api';
import { uploadImages, uploadTypes, alias } from '../modules/uploadOssAll';

let current_fs, next_fs, previous_fs,
    left, opacity, scale,
    animating,
    // animating = false;
    idCardNumber = $('#idCardNumber'),
    id_card_front_image = $('#id_card_front_image'),
    id_card_front_input = $('#id_card_front_input'),
    id_card_back_image = $('#id_card_back_image'),
    id_card_back_input = $('#id_card_back_input'),

    lpprefix = $('#lpprefix'),
    licensePlateNumber = $('#licensePlateNumber'),
    drivingLicenseNumber = $('#drivingLicenseNumber'),
    drivingLicenseRegTime = $('#drivingLicenseRegTime'),
    car_license_front_image = $('#car_license_front_image'),
    car_license_front_input = $('#car_license_front_input'),
    car_license_back_image = $('#car_license_back_image'),
    car_license_back_input = $('#car_license_back_input'),


    baodanDate = $('#baodanDate'),
    bao_dan_page_01_image = $('#bao_dan_page_01_image'),
    bao_dan_page_01_input = $('#bao_dan_page_01_input'),
    bao_dan_page_02_image = $('#bao_dan_page_02_image'),
    bao_dan_page_02_input = $('#bao_dan_page_02_input'),
    bao_dan_page_03_image = $('#bao_dan_page_03_image'),
    bao_dan_page_03_input = $('#bao_dan_page_03_input');
/**
 * 获取注册节点
 */



let uploaders = {
    idCardFrontUrl: uploadImages(id_card_front_input[0], progress),
    idCardBackUrl: uploadImages(id_card_back_input[0], progress),
    drivingLicenseFrontUrl: uploadImages(car_license_front_input[0], progress),
    drivingLicenseBackUrl: uploadImages(car_license_back_input[0], progress),
    baodanUrl1: uploadImages(bao_dan_page_01_input[0], progress),
    baodanUrl2: uploadImages(bao_dan_page_02_input[0], progress),
    baodanUrl3: uploadImages(bao_dan_page_03_input[0], progress)
};


function progress(fileInputDom, percent) {
    console.log(percent)
    let progressWarpper = $(fileInputDom).next(),
        progresser = progressWarpper.find('.progress'),
        progressText = progressWarpper.find('.progress-text');
    console.log(progresser);
    progressWarpper.fadeIn();
    if (percent < 100) {
        progresser.css('width', percent + '%');
        progressText.text('上传中' + percent + '%');
    } else {
        progressText.text('上传成功');
    }
}


/**
 * 初始化Oss相关模块
 */
async function initOssAll(draftBoxData) {
    idCardNumber.val(draftBoxData.idCardNumber);
    id_card_front_image.attr('src', draftBoxData.idCardFrontImg || '');
    id_card_back_image.attr('src', draftBoxData.idCardBackImg || '');

    car_license_front_image.attr('src', draftBoxData.drivingLicenseFrontImg || '');
    car_license_back_image.attr('src', draftBoxData.drivingLicenseBackImg || '');


    licensePlateNumber.val(draftBoxData.licensePlateNumber ? draftBoxData.licensePlateNumber.substr(1) : '');
    drivingLicenseNumber.val(draftBoxData.drivingLicenseNumber || '');
    drivingLicenseRegTime.val(draftBoxData.drivingLicenseRegTime || '');



    baodanDate.val(draftBoxData.baodanDate);
    let types = [];
    let uploadImgKey = {
        idCardFrontUrl: '',
        idCardBackUrl: '',
        drivingLicenseFrontUrl: '',
        drivingLicenseBackUrl: '',
        baodanUrl1: '',
        baodanUrl2: '',
        baodanUrl3: ''
    }
    $('.file').on('change', async function(e) {
        let file = e.target.files[0];
        let dataUrl = window.URL.createObjectURL(file);
        let key = $(this).attr('uploadType');
        $(this).prev().attr('src', dataUrl);
        uploaders[key].addFile(file);
        // uploadTypes['upload' + key](uploaders[key]);
        $.extend(uploadImgKey, {
            [key]: `dev/${mobile}${alias[key]}.png`
        });
        types.push(key);
        console.log(uploadImgKey);
    });


    $('#papers').on('click', async function(e) {
        let vehicleNumber = lpprefix.attr('code') + licensePlateNumber.val();

        if (until.isEmpty(idCardNumber.val())) {
            alert('身份证号码不能为空');
            return;
        }

        if (!until.isIdCard(idCardNumber.val())) {
            alert('请输入正确的身份证号码');
            return;
        }

        if (until.isEmpty(licensePlateNumber.val())) {
            alert('车牌号码不能为空');
            return;
        }
        if (!until.isVehicleNumber(vehicleNumber)) {
            alert('请输入正确的车牌号码');
        }
        if (until.isEmpty(drivingLicenseNumber.val())) {
            alert('行驶证号码不能为空');
            return;
        }
        if (until.isEmpty(drivingLicenseRegTime.val())) {
            alert('行驶证注册日不能为空');
            return;
        }
        if (until.isEmpty(baodanDate.val())) {
            alert('续保日期不能为空');
            return;
        }
        if (types.length > 0) {
            types.forEach(key => {
                uploadTypes['upload' + key](uploaders[key]);
            })
        }


        let result = await saveDraftBox(draftBoxData.mobile, $.extend({}, {
            idCardNumber: idCardNumber.val(),
            licensePlateNumber: vehicleNumber,
            drivingLicenseNumber: drivingLicenseNumber.val(),
            drivingLicenseRegTime: drivingLicenseRegTime.val(),
            baodanDate: baodanDate.val()
        }, uploadImgKey));
        if (result.success) {
            pageNext.call(this);
        }
    })
}


async function initPersonInfo(draftBoxData) {
    $('#CarBrandList').html(tem('CarBrandItem', {
        carBrandList: await getCarBrandList(),
        carBrandCode: draftBoxData.carBrandCode,
    }));
    carModel(draftBoxData.carBrandCode || 1, draftBoxData.carModelCode);
    let mobile = $('#mobile'); //手机号码
    let name = $('#name'); //姓名
    let genderCode = $('#genderCode'); //性别
    let carBrandCode = $('#carBrandCode'); //汽车品牌
    let carModelCode = $('#carModelCode'); //车型

    let carPrice = $('#carPrice'); //车价
    let carMileage = $('#carMileage'); //里程
    let recommendClientMobile = $('#recommendClientMobile'); //推荐人

    $('#mobile').val(draftBoxData.mobile || '');
    name.val(draftBoxData.name || '');
    genderCode.attr('code', draftBoxData.genderCode || '1').text((draftBoxData.genderCode === '1' ? '先生' : '女士'));
    recommendClientMobile.val(draftBoxData.recommendClientMobile || '');
    carPrice.val(draftBoxData.carPrice);
    carMileage.val(draftBoxData.carMileage);
    console.log(draftBoxData.carBrandCode);

    $('#CarBrandList').on('click', e => {
        let target = e.target;
        let tagname = target.nodeName.toLowerCase();
        if (tagname === 'li') {
            carModel($(target).attr('code'));
        }
    })



    /**
     * 个人信息提交
     */
    $('#personInfo').click(async function() {
        if (until.isEmpty(mobile.val())) {
            alert('手机号码不能为空');
            return;
        }
        if (until.isEmpty(name.val())) {
            alert('姓名不能为空');
            return;
        }
        if (until.isEmpty(carPrice.val())) {
            alert('车价不能为空');
            return;
        }
        if (until.isEmpty(carMileage.val())) {
            alert('里程不能为空');
            return;
        }
        console.log(carBrandCode.attr('code'));
        let result = await saveDraftBox(mobile.val(), {
            name: name.val(),
            genderCode: genderCode.attr('code'),
            carBrandCode: carBrandCode.attr('code'),
            carModelCode: $('#carModelCode').attr('code'),
            carPrice: carPrice.val(),
            carMileage: carMileage.val(),
            recommendClientMobile: recommendClientMobile.val() || ''
        });
        if (result.success) {
            pageNext.call(this);
        }
    })

}
async function carModel(bradCode, carModelCode) {
    let carModelList = await getCarModelList(bradCode);
    tem.defaults.imports.getTitle = a => {
        let title;
        carModelList.forEach(item => {
            console.log(item.code)
            if (item.code == a) {
                title = item.title;
            }
        });

        return title;
    }
    $('#CarModelList').html(tem('CarModelItem', {
        carModelList: carModelList || [{ title: '暂时没有该车型' }],
        carModelCode: carModelCode
    }));
}
/**
 * 初始化VIP类型
 */
async function initClitypes({ vipLevelCode }) {
    $('#vipLevelCode').attr('code', vipLevelCode || 1);
    tem.defaults.imports.timestamp = a => {
        return a.replace(/(套餐包.+\n.+)/gmi, '').replace('该套餐', '');
    }
    $('#vipLevelCode').html(tem('clitype-tem', { clitypes: await clitypes(), vipLevelCode: vipLevelCode || 1 }));
    let cliters = $('#vipLevelCode').find('.cliter');
    cliters.on('click', function() {

        cliters.removeClass('active');
        $(this).addClass('active');
        $(this).parent().attr('code', $(this).attr('code'));
    });

    $('#vipLevel').click(async function() {
        let vipcode = $('#vipLevelCode').attr('code');

        let result = await saveDraftBox(until.getItem('mobile'), {
            vipLevelCode: vipcode,

        });
        if (result.success) {
            pageNext.call(this);
        }
    })
};


/**
 * 初始化草稿箱数据
 */
async function initDraftBox(mobile) {
    until.loading('加载数据。。。')
    let data = await getDraftBox(until.getItem('mobile') || mobile);
    until.closeLoading();
    initPersonInfo(data);
    initClitypes(data);
    initOssAll(data);

    $('#lpprefix-list').html(tem('lpprefix-tem', { lpprefixList: await getLpprefixList() }));
}





function pageNext() {

    if (animating) return false;
    animating = true;
    console.log($(this));
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    next_fs.show();
    console.log('页面跳转')
    current_fs.animate({
        opacity: 0
    }, {
        step: function(now, mx) {


            scale = 1 - (1 - now) * 0.2;

            left = (now * 50) + "%";

            opacity = 1 - now;
            current_fs.css({
                '-webkit-transform': 'scale(' + scale + ')',
                'transform': 'scale(' + scale + ')'
            });
            next_fs.css({
                'transform': 'translate3d(' + left + ',0,0)',
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        easing: 'easeInOutBack'
    });
}

function pagePrev() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();


    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");


    previous_fs.show();

    current_fs.animate({
        opacity: 0
    }, {
        step: function(now, mx) {


            scale = 0.8 + (1 - now) * 0.2;

            left = ((1 - now) * 50) + "%";

            opacity = 1 - now;
            current_fs.css({
                'transform': 'translate3d(' + left + ',0,0)'
            });
            previous_fs.css({
                'transform': 'scale(' + scale + ')',
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },

        easing: 'easeInOutBack'
    });
}

$('.previous').on('click', function() {
    pagePrev.call(this);
    console.log(11)
});
/**
 * 初始化汽车品牌和汽车车型
 */
$(function() {
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
    $('#mobile').on('change', function(e) {
        let name = e.target.value;

        if (!until.isPhone(name)) {
            $(this).addClass('active');
            alert('请输入正确的手机号码')
        } else {
            until.setItem('mobile', name);
            initDraftBox();
        }
    });


    initDraftBox();
})








$(".submit").click(function() {
    return false;
});