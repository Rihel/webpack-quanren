import until from './until';

let tokenUrl = 'http://m.qren163.cn:8080/v1/api/auth/upload/token';

let imgTypes = {
        idCardFrontUrl: '_id_card_front',
        idCardBackUrl: '_id_card_back',
        drivingLicenseFrontUrl: '_car_license_front',
        drivingLicenseBackUrl: '_car_license_back',
        baodanUrl1: '_bao_dan_page_01',
        baodanUrl2: '_bao_dan_page_02',
        baodanUrl3: '_bao_dan_page_03',
        carMileageUrl: '_carMileageUrl',
        carAcceptedUrl: '_111_carAcceptedUrl',
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

function uploadImagesToAliOSS(fileInputName, progress) {
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

        console.log(files);
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


export const uploadImages = function(inputDom, progress) {
    return uploadImagesToAliOSS(inputDom, progress)
}
export const uploadTypes = uploadType;

console.log(uploadTypes);
export const alias = imgTypes;