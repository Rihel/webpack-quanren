import '../scss/common.scss';
import '../scss/font.scss';
import '../scss/register.scss';


import until from '../modules/until';
import tem from '../modules/template-web';
import { alert, dialog } from '../modules/dialog';
import {
    client_clitypes,
    client_getDraftBox,
    client_getCarBrandList,
    client_getCarModelList,
    client_saveDraftBox,
    client_getLpprefixList,
    client_getVcode,
    client_register,
    client_isReg,
} from '../api/api';
import { uploadImages, uploadTypes, alias, previewImage } from '../modules/uploadOssAll';



/**
 * 整个流程的入口
 */
$(function () {

    /**
     * 下拉框的操作，利用事件委托达到不同效果
     */
    $('.drop').click(function (e) {

        let target = e.target,
            tagname = target.nodeName.toLowerCase();
        if (tagname === 'h3') {
            // $('#msform').find('.drop-menu').not($(this).next()).slideUp();
            $(target).toggleClass('active');
            // $('.drop-menu').hide();
            $('.close').hide();
            $(target).prev().show();
            $('#msform').find('.drop-menu').not($(this)).slideUp();
            $(e.target).next().slideDown();

        }
        if ($(target).hasClass('close')) {
            $(target).nextAll('ul.drop-menu').slideUp();
            $(target).hide();
        }

        if (tagname === 'li') {
            let code = $(target).attr('code'),
                text = $(target).text(),
                dropMenu = $(target).parent(),
                title = dropMenu.prev();
            dropMenu.slideUp();
            title.text(text).attr('code', code);
            title.toggleClass('active')
            $('.close').hide();

        }


    });


    /**
     * 当用户信息的手机号码发生改变的时候，会从后台请求数据，初始化
     * 
     * 如果本地存储有手机号码，那么就会自动获取数据，进行初始化
     */
    // $('#mobile').on('change', function(e) {
    //     let name = e.target.value;

    //     if (!until.isPhone(name)) {
    //         $(this).addClass('active');
    //         alert('请输入正确的手机号码')
    //     } else {
    //         until.setItem('mobile', Number(name));
    //         initDraftBox(name);
    //     }
    // });

    let isRegBtn = $('.isreg-btn'),
        urlMobile = until.urlParams().mobile,
        isRegText = $('.isreg-text');
    isRegBtn.click(async function (e) {
        if (until.isEmpty(isRegText.val())) {
            alert('手机号码不能为空');
            return;
        }
        if (!until.isPhone(isRegText.val())) {
            alert('请输入正确的手机号码')
            return;
        };
        let { success } = await client_isReg(isRegText.val());
        if (success) {
            dialog({
                title: '温馨提醒',
                content: '该手机号码已经注册,请换另外一个手机号码进行注册',
                btns: ['去登录', '取消'],
                btnsCallback: function (btns) {
                    until.setItem('mobile', isRegText.val());
                    console.log($(btns).get(0));
                    $(btns[0]).on('click', e => {
                        until.jumpPage('login');
                    })
                    $(btns[1]).on('click', e => {
                        isRegText.val('');
                    })
                }
            })
        } else {
            initDraftBox(isRegText.val());
            until.setItem('mobile', isRegText.val());
            $(this).parent().hide();
            $('#msform').show();
        }
    })


    if (urlMobile) {
        /**
         * 审核驳回处理
         */
        initDraftBox(urlMobile);
        until.setItem('mobile', urlMobile);
        isRegBtn.parent().hide();
        $('#msform').show();
    }

    //   initDraftBox(13533797833)


})

/**************全局变量************** */
/**
 * 页面切换变量
 */
let current_fs, next_fs, previous_fs,
    left, opacity, scale,
    animating,
    recommendClientMobileText = '',
    /**
     * 身份证信息相关节点
     */
    idCardNumber = $('#idCardNumber'),
    id_card_front_image = $('#id_card_front_image'),
    id_card_front_input = $('#id_card_front_input'),
    id_card_back_image = $('#id_card_back_image'),
    id_card_back_input = $('#id_card_back_input'),


    /**
     * 车牌号码和行驶证相关节点
     */
    lpprefix = $('#lpprefix'),
    licensePlateNumber = $('#licensePlateNumber'),
    drivingLicenseNumber = $('#drivingLicenseNumber'),
    drivingLicenseRegTime = $('#drivingLicenseRegTime'),
    car_license_front_image = $('#car_license_front_image'),
    car_license_front_input = $('#car_license_front_input'),
    car_license_back_image = $('#car_license_back_image'),
    car_license_back_input = $('#car_license_back_input'),


    /**
     * 保单号码和照片相关节点
     */
    baodanDate = $('#baodanDate'),
    bao_dan_page_01_image = $('#bao_dan_page_01_image'),
    bao_dan_page_01_input = $('#bao_dan_page_01_input'),
    bao_dan_page_02_image = $('#bao_dan_page_02_image'),
    bao_dan_page_02_input = $('#bao_dan_page_02_input'),
    bao_dan_page_03_image = $('#bao_dan_page_03_image'),
    bao_dan_page_03_input = $('#bao_dan_page_03_input');


/**************全局变量************** */

/**
 * 初始化oss的上传Uploader
 */
let uploaders = {
    idCardFrontUrl: uploadImages(id_card_front_input[0], progress, alias['idCardFrontUrl'].substr(1)),
    idCardBackUrl: uploadImages(id_card_back_input[0], progress, alias['idCardBackUrl'].substr(1)),
    drivingLicenseFrontUrl: uploadImages(car_license_front_input[0], progress, alias['drivingLicenseFrontUrl'].substr(1)),
    drivingLicenseBackUrl: uploadImages(car_license_back_input[0], progress, alias['drivingLicenseBackUrl'].substr(1)),
    baodanUrl1: uploadImages(bao_dan_page_01_input[0], progress, alias['baodanUrl1'].substr(1)),
    baodanUrl2: uploadImages(bao_dan_page_02_input[0], progress, alias['baodanUrl2'].substr(1)),
    baodanUrl3: uploadImages(bao_dan_page_03_input[0], progress, alias['baodanUrl3'].substr(1))
};
console.log(uploaders)
/**
 * 上传进度制作
 * @param {Element} fileInputDom 上传input节点
 * @param {Number} percent  上传进度
 */
function progress(fileInputDom, percent) {
    let progressWarpper = $(fileInputDom).next(),
        progresser = progressWarpper.find('.progress'),
        progressText = progressWarpper.find('.progress-text');

    progressWarpper.fadeIn();
    if (percent < 100) {
        progresser.css('width', percent + '%');
        progressText.text('上传中' + percent + '%');

    } else {
        until.closeLoading();

    }
}



/**
 * 初始化草稿箱数据，将获取的草稿箱数据分发给各个模块
 * 
 * initPersonInfo() 初始化个人信息相关模块以及相关操作
 * initClitypes（） 初始化VIP等级相关模块以及相关操作
 * initOssAll()  初始化证件相关的数据以及相关操作
 * reg（） 初始化注册模块的操作以及验证
 */
async function initDraftBox(mobile) {
    until.loading('加载数据。。。')
    let data = await client_getDraftBox(mobile);
    until.closeLoading();
    initPersonInfo(data);
    initClitypes(data);
    initOssAll(data);
    reg();
    until.renderTem('lpprefix-list', 'lpprefix-tem', { lpprefixList: await client_getLpprefixList() })
}


/**
 * 初始化Oss相关模块
 */
async function initOssAll(draftBoxData) {
    console.log(draftBoxData);
    /*************相关节点的数据初始化开始*******************/
    idCardNumber.val(draftBoxData.idCardNumber);
    id_card_front_image.attr('src', draftBoxData.idCardFrontImg || '');
    id_card_back_image.attr('src', draftBoxData.idCardBackImg || '');

    car_license_front_image.attr('src', draftBoxData.drivingLicenseFrontImg || '');
    car_license_back_image.attr('src', draftBoxData.drivingLicenseBackImg || '');


    bao_dan_page_01_image.attr('src', draftBoxData.baodanImg1 || '');
    bao_dan_page_02_image.attr('src', draftBoxData.baodanImg2 || '');
    bao_dan_page_03_image.attr('src', draftBoxData.baodanImg3 || '');



    licensePlateNumber.val(draftBoxData.licensePlateNumber ? draftBoxData.licensePlateNumber.substr(1) : '');
    drivingLicenseNumber.val(draftBoxData.drivingLicenseNumber || '');
    drivingLicenseRegTime.val(draftBoxData.drivingLicenseRegTime || '');

    baodanDate.val(draftBoxData.baodanDate);

    /*************相关节点的数据初始化结束*******************/

    let types = []; //这个数组，是将需要上传到oss的证件类型KEY存储起来

    /********这个对象是用来存储草稿箱图片的路径（ps：dev/13xxxxxxxx）***********/
    let uploadImgKey = {
        idCardFrontUrl: '',
        idCardBackUrl: '',
        drivingLicenseFrontUrl: '',
        drivingLicenseBackUrl: '',
        baodanUrl1: '',
        baodanUrl2: '',
        baodanUrl3: ''
    }


    /**
     * 当文件input值改变的时候，types会对应的uploadType（ps：即是上传证件的类型，是身份证还是保单）
     * 会让对应的uploader添加文件
     */
    $('.file').on('change', function (e) {
        console.log($(this), '事件源')
        let file = e.target.files[0];
        let postfix = /\.[^\.]+$/.exec(file.name);
        if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
            alert('这个不是图片哟,重新上传吧');
            return;
        }
        console.log(postfix);
        let dataUrl = window.URL.createObjectURL(file);


        console.log(`图片的URL${dataUrl}`)

        let key = $(this).attr('uploadType');
        $(this).prev().attr('src', dataUrl);
        uploaders[key].addFile(file);

        // uploadTypes['upload' + key](uploaders[key]);
        // console.log(`dev/${until.getItem('mobile')}${alias[key]}${postfix[0]}`, '添加上传名称');
        $.extend(uploadImgKey, {
            [key]: `dev/${until.getItem('mobile')}${alias[key]}${postfix[0]}`
        });
        types.push(key);

    });
    $('input[id^="html5"]').on('change', function (e) {
        let key = $(this).parent().prevAll('.file').attr('uploadType');
        let file = uploaders[key].files[0];
        let postfix = /\.[^\.]+$/.exec(file.name);
        if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
            alert('这个不是图片哟,重新上传吧');
            return;
        }


        $.extend(uploadImgKey, {
            [key]: `dev/${until.getItem('mobile')}${alias[key]}${postfix[0]}`
        });
        types.push(key);
        console.log(uploadImgKey, types);
    })

    console.log(uploaders, '上传类型')
    $('#papers').on('click', async function (e) {
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
            return;
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
        let query = 0;

        console.log(types);

        let self = this;
        async function UPLOAD() {
            let key = types[query];
            // let arg = arguments;
            if (query < types.length) {
                uploadTypes['upload' + key](uploaders[key], until.getItem('mobile'));
                uploaders[key].bind('BeforeUpload', function () {
                    until.loading('正在上传数据....')
                })

                uploaders[key].bind('UploadComplete', function () {

                    query++;
                    UPLOAD()
                    console.log('UploadComplete', key);
                })

            } else {

                let result = await client_saveDraftBox(draftBoxData.mobile, $.extend({}, {
                    idCardNumber: idCardNumber.val(),
                    licensePlateNumber: vehicleNumber,
                    drivingLicenseNumber: drivingLicenseNumber.val(),
                    drivingLicenseRegDate: drivingLicenseRegTime.val(),
                    baodanDate: baodanDate.val()
                }, uploadImgKey));
                if (result.success) {
                    until.closeLoading();
                    pageNext.call(self);

                }

            }
        }

        UPLOAD();



        console.log(`
        /**********证件上传部分开始保存草稿箱*************/
            保存的数据为\n
            身份证号码${idCardNumber.val()}，\n
            车牌号号${vehicleNumber}，\n
            行驶证号码${drivingLicenseNumber.val()}，\n
            行驶证注册日${drivingLicenseRegTime.val()}，\n
            保单续费日${baodanDate.val()}\n
        /**********证件保存部分结束保存草稿箱*************/
        `)

    })
}


async function initPersonInfo(draftBoxData) {

    until.renderTem('CarBrandList', 'CarBrandItem', {
        carBrandList: await client_getCarBrandList(),
        carBrandCode: defaultData(draftBoxData.carBrandCode),
    })
    console.log(draftBoxData.carBrandCode);
    carModel(defaultData(draftBoxData.carBrandCode), defaultData(draftBoxData.carModelCode));
    let mobile = $('#mobile'), //手机号码
        name = $('#name'), //姓名
        genderCode = $('#genderCode'), //性别
        carBrandCode = $('#carBrandCode'), //汽车品牌
        carModelCode = $('#carModelCode'), //车型
        carPrice = $('#carPrice'), //车价
        carMileage = $('#carMileage'), //里程
        recommendClientMobile = $('#recommendClientMobile'); //推荐人

    $('#mobile').val(draftBoxData.mobile || '');
    name.val(draftBoxData.name || '');
    genderCode.attr('code', defaultData(draftBoxData.genderCode)).text((draftBoxData.genderCode === 1 ? '先生' : '女士'));
    recommendClientMobile.val(draftBoxData.recommendClientMobile || '');
    carPrice.val(draftBoxData.carPrice);
    carMileage.val(draftBoxData.carMileage);

    recommendClientMobile.on('input', async function (e) {
        let val = $(this).val();
        let mess;
        console.log(`推荐人手机号码为${val}`)
        if (!until.isPhone(val)) {
            mess = '您输入的推荐人手机号不是手机号码';
        } else {
            let data = await client_isReg(val);
            if (data.success) {
                mess = '';
                recommendClientMobileText = val;
            } else {
                mess = '您输入的推荐人手机号并不是有效的全仁会员手机号码'
                recommendClientMobileText = '';
            }
        }
        $('.mess').html(mess);
    })
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
    $('#personInfo').click(async function () {
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
        console.log(`
        /**********个人信息部分开始保存草稿箱*************/
            保存的数据为\n
            姓名号码：${name.val()}，\n
            性别代码：${genderCode.attr('code')}，\n
            汽车品牌代码：${carBrandCode.attr('code')}，\n
            汽车车型代码：${$('#carModelCode').attr('code')}，\n
            汽车价格：${carPrice.val()}\n
            汽车里程：${carMileage.val()}\n
            推荐人手机号码：${recommendClientMobileText}\n
        /**********个人信息部分结束保存草稿箱*************/
        `)
        let result = await client_saveDraftBox(mobile.val(), {
            name: name.val(),
            genderCode: genderCode.attr('code'),
            carBrandCode: carBrandCode.attr('code'),
            carModelCode: $('#carModelCode').attr('code'),
            carPrice: carPrice.val(),
            carMileage: carMileage.val(),
            recommendClientMobile: recommendClientMobileText
        });
        if (result.success) {
            pageNext.call(this);
        }
    })

}


/**
 * 渲染对应的汽车品牌下拉菜单
 * @param {Number} bradCode 汽车品牌代码
 * @param {Number} carModelCode 汽车车型代码（默认为当前汽车品牌代码的第一个）
 */
async function carModel(bradCode, carModelCode) {
    let carModelList = await client_getCarModelList(bradCode);
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
    until.renderTem('CarModelList', 'CarModelItem', {
        carModelList: carModelList || [{ title: '暂时没有该车型' }],
        carModelCode: defaultData(carModelCode, carModelList[0].code)
    })
}


/**
 * 初始化VIP类型
 */
async function initClitypes({ vipLevelCode }) {
    $('#vipLevelCode').attr('code', vipLevelCode || 1);
    tem.defaults.imports.timestamp = a => {
        return a.replace(/(套餐包.+\n.+)/gmi, '').replace('该套餐', '');
    }

    until.renderTem('vipLevelCode', 'clitype-tem', { clitypes: await client_clitypes(), vipLevelCode: defaultData(vipLevelCode) })

    let cliters = $('#vipLevelCode').find('.cliter');
    cliters.on('click', function () {

        cliters.removeClass('active');
        $(this).addClass('active');
        $(this).parent().attr('code', $(this).attr('code'));
    });

    $('#vipLevel').click(async function () {
        let vipcode = $('#vipLevelCode').attr('code');

        let result = await client_saveDraftBox(until.getItem('mobile'), {
            vipLevelCode: vipcode,

        });
        console.log(`
        /**********VIP选择开始保存草稿箱*************/
            保存的数据为\n
            vip代码为${vipcode}\n
        /**********VIP选择保存草稿箱*************/
        `)
        if (result.success) {
            pageNext.call(this);
        }
    })
};


/**
 * 初始化注册窗口
 */
async function reg() {
    let vcodeBtn = $('.vcode-btn'),
        vcode = $('#vcode'),
        passwd = $('#passwd'),
        surepasswd = $('#surepasswd'),
        registerbtn = $('.register');
    let min = 30;
    let passwordStrong = $('.password-strong');


    /**
     * 密码强度校验
     */
    passwd.on('input', function () {
        passwordStrong.show();
        let len = $(this).val().length;
        if (len < 8) {
            passwordStrong.find('li').removeAttr('class');
            passwordStrong.find('li').eq(0).addClass('error');
        }
        if (len > 8 && len < 14) {
            passwordStrong.find('li').removeAttr('class');
            passwordStrong.find('li').eq(0).addClass('warring');
            passwordStrong.find('li').eq(1).addClass('warring');
        }
        if (len > 14) {
            passwordStrong.find('li').removeAttr('class');
            passwordStrong.find('li').addClass('success');

        }
    })



    vcodeBtn.click(async (e) => {
        if (until.isEmpty(passwd.val())) {
            alert('密码不能为空');
            return;
        }
        if (until.isEmpty(surepasswd.val())) {
            alert('重复密码不能为空');
            return;
        }
        if (passwd.val() !== surepasswd.val()) {
            alert('两次密码不一致，请重新输入...');
            passwd.val('');

            return;
        }

        /**
         * 获取验证码
         */
        let verifyCode = await client_getVcode(until.getItem('mobile'));
        console.log(verifyCode, '验证码')
        if (verifyCode.success) {
            vcodeBtn.prop('disabled', 'disabled');
            registerbtn.removeAttr('disabled');
        } else {
            alert('获取验证码太频繁了，稍等下吧~~');
            return;
        }

        /**
         * 获取验证码倒计时
         */
        let timer = setInterval(function () {
            if (min > 0) {
                vcodeBtn.val(min + 's');
                min--;
            } else {
                clearInterval(timer);
                vcodeBtn.val('获取验证码');
                vcodeBtn.removeProp('disabled');
            }
        }, 1000);

        registerbtn.on('click', async function () {

            if (vcode.val() != verifyCode.data.vCode) {
                alert('验证码错误，请重新输入');
                return;
            }

            /**
             * 获取草稿信息
             */
            let draftBoxData = await client_getDraftBox(until.getItem('mobile'));

            /**
             * 发送注册请求，合并草稿和验证码密码
             */
            let result = await client_register($.extend({}, {
                passwd: passwd.val(),
                verifyCode: vcode.val(),
            }, draftBoxData));
            if (result.success) {

                dialog({
                    title: '尊敬的用户你好',
                    btns: ['确认并返回登录页'],
                    btnsCallback(btns) {
                        btns.click(e => {
                            until.jumpPage('login', { p: until.getItem('mobile') });
                        })
                    }
                })
            }
        })

    })

}






/**
 * 从后台获取的草稿箱数据，如果有的话就返回，如果没有，则返回code，code默认为1
 * 
 * @param {any} data 草稿箱获得的数据
 * @param {Number} number 代码
 */
function defaultData(data, code = 1) {
    return data !== undefined ? data : code;
}











/**
 * 下一页的页面控制，这个主要是在上传数据的时候调用，当然，要上传数据通过后才可以调用
 */
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
            step: function (now, mx) {


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
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            easing: 'easeInOutBack'
        });
}


/**
 * 上一页的页面控制
 */
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
            step: function (now, mx) {


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
            complete: function () {
                current_fs.hide();
                animating = false;
            },

            easing: 'easeInOutBack'
        });
}

/**
 * 上一页是必须会有的
 */
$('.previous').on('click', function () {
    pagePrev.call(this);
});