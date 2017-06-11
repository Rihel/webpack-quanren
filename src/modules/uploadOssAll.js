import until from './until';

let tokenUrl = 'http://m.qren163.cn:8080/v1/api/auth/upload/token';

/**
 
使用指南

1.按照下列代码搭建结构
<div class="image-file">
    <img id="【上传图片的前缀】_image" src="" alt="">
    <input class="file" id="b【上传图片按钮的前缀】_input" uploadType="标识符===【alias】" type="file">
    <div class="progress-warpper">
        <div class="progress"></div>
        <div class="progress-text">
            正在上传中...
        </div>
    </div>
    <span>上传第二页</span>
</div>

2. 初始化uploader
 uploadImages(bao_dan_page_03_input[0], progress, alias['baodanUrl3'].substr(1))


 3.添加事件，由于plupload是自动生成input，导致有时无法获得图片URL,所以两个版本


   a.  自己的input出现的情况
$('.file').on('change', function(e) {
    console.log($(this), '事件源')
    let file = e.target.files[0];
    let postfix = /\.[^\.]+$/.exec(file.name);
    if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
        alert('这个不是图片哟,重新上传吧');
        return;
    }
    console.log(postfix);
    let dataUrl = window.URL.createObjectURL(file);
    let key = $(this).attr('uploadType');
    $(this).prev().attr('src', dataUrl);
    uploaders[key].addFile(file);

    $.extend(uploadImgKey, {
        [key]: `dev/${until.getItem('mobile')}${alias[key]}${postfix[0]}`
    });
    types.push(key);
});

 b.  插件自带的input出现的情况
$('input[id^="html5"]').on('change', function(e) {
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




demo:

这是一个上传身份证反面的demo

先搭建一个结构
<div class="image-file">
    <img id="id_card_back_image" src="" alt="">
    <input class="file" id="id_card_back_input" uploadType="idCardBackUrl" type="file">
    <div class="progress-warpper">
        <div class="progress"></div>
        <div class="progress-text">
            正在上传中...
        </div>
    </div>
    <span>上传反面</span>
</div>


实例化一个uploader


 let idCradBackUploader=uploadImages($('#id_card_back_input')[0], progress, alias['baodanUrl3'].substr(1));

添加文件动作


 进行上传操作

uploadTypes(idCradBackUploader,until.mobile('mobile'));===>上传的文件更名为:手机号码+_id_card_front.后缀




 */

let imgTypes = {
        idCardFrontUrl: '_id_card_front', //身份证正面
        idCardBackUrl: '_id_card_back', //身份证反面
        drivingLicenseFrontUrl: '_car_license_front', //行驶证正面
        drivingLicenseBackUrl: '_car_license_back', //行驶证反面
        baodanUrl1: '_bao_dan_page_01', //保单1
        baodanUrl2: '_bao_dan_page_02', //保单2
        baodanUrl3: '_bao_dan_page_03', //保单3
        carMileageUrl: '_carMileageUrl', //里程表
        carAcceptedUrl: '_111_carAcceptedUrl', //
        carMxpjdUrl: ' _111_carMxpjdUrl',
        repair_price_sheet: '_repair_price_sheet'
    }
    // console.log(plupload)

function getInputFileName(fileinputDOM, cname, initname) {

    return new Promise((resolve, reject) => {
        let postfix = /.+\.(jpg|png|gif)$/.exec(fileinputDOM);
        if (postfix == undefined || postfix == null) {
            postfix = ".jpg";
        }

        let fileSuffix = postfix[1].toString().toLowerCase();
        resolve(initname + cname + '.' + fileSuffix);
    });
}

function uploadImagesToAliOSS(fileInputName, progress, imgIdKey, fileses) {
    let uploader = new plupload.Uploader({ //实例化一个plupload上传对象
        browse_button: fileInputName,
        url: 'http://oss.aliyuncs.com',
        filters: {
            mime_types: [ //只允许上传图片文件
                {
                    title: "Image files",
                    extensions: "*", //fxxk : android mobile might have file without extension
                    //extensions : "jpg,png,bmp,jpeg",
                }
            ],
            max_file_size: '8mb', //最大只能上传8mb的文件
            prevent_duplicates: true //不允许选取重复文件
        }
    });
    uploader.init(); //初始化

    //绑定文件添加进队列事件
    uploader.bind('FilesAdded', function(uploader, files) {
        console.log(imgIdKey);
        previewImage(files[0], function(imgsrc) {
            $(`#${imgIdKey}_image`).attr('src', imgsrc);
            if (fileses) {

            }
        })
    });

    //绑定文件上传进度事件
    uploader.bind('UploadProgress', function(uploader, file) {

        progress && progress(fileInputName, file.percent)
    });
    uploader.bind('FileUploaded', function(uploader, file, response) {
        console.log('FileUploaded', uploader, file);
    });
    uploader.bind('PostInit', function(uploader, file) {

    })

    //上传按钮
    return uploader;
}
export const previewImage = (file, callback) => { //file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if (!file || !/image\//.test(file.type)) return; //确保文件是图片
    if (file.type == 'image/gif') { //gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        var fr = new mOxie.FileReader();
        fr.onload = function() {
            callback(fr.result);
            fr.destroy();
            fr = null;
        }
        fr.readAsDataURL(file.getSource());
    } else {
        var preloader = new mOxie.Image();
        preloader.onload = function() {
            //preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback && callback(imgsrc); //callback传入的参数为预览图片的url
            preloader.destroy();
            preloader = null;
        };
        preloader.load(file.getSource());
    }
}

function upload(uploader, imgType, initname) {

    $.post(tokenUrl)
        .then(function(result) {


            let tokenData = result.data;
            if (uploader.files.length > 0) {
                getInputFileName(uploader.files[0].name, imgType, initname)
                    .then(function(file_name) {
                        let ossObjKey = tokenData.dir + file_name;
                        console.log(ossObjKey, '上传中的。。。。');

                        let uploadParams = {
                            'key': ossObjKey,
                            'policy': tokenData["policy"],
                            'OSSAccessKeyId': tokenData["accessId"],
                            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                            'callback': "",
                            'signature': tokenData["signature"],
                        };
                        uploader.setOption({
                            url: tokenData.formUrl,
                            'multipart_params': uploadParams
                        })
                        uploader.start(); //开始上传
                    })
            }
        });
}

let uploadType = {};
for (let key in imgTypes) {
    uploadType['upload' + key] = function(uploader, initname) {
        upload(uploader, imgTypes[key], initname);
    }
}

/**
 * 实例化uploader
 * @param {Element} inputDom input对象
 * @param {Function} progress 进度条
 * @param {String} imgIdKey 上传到服务器的图片KET
 */
export const uploadImages = function(inputDom, progress, imgIdKey) {
    return uploadImagesToAliOSS(inputDom, progress, imgIdKey)
}
export const uploadTypes = uploadType;

console.log(uploadTypes);
export const alias = imgTypes;