import "../scss/server.scss";
import "../scss/font.scss";
import './menu_toggle';


import until from '../modules/until';
import tem from '../modules/template-web';
import { server_OrderDetail, server_finish } from '../api/api';
import { alert, jumpPage } from '../modules/dialog';
import { uploadImages, uploadTypes, alias } from '../modules/uploadOssAll';

let uploaders = {
    carMileageUrl: uploadImages($('#carMileageUrl')[0]),
    carAcceptedUrl: uploadImages($('#carAcceptedUrl')[0]),
    carMxpjdUrl: uploadImages($('#carMxpjdUrl')[0]),
}

tem.defaults.imports.washServiceLabel = OrderData => {
    return until.GetOrderServiceLabel(OrderData)
}
console.log(uploaders)
$(async function() {
    let order = await server_OrderDetail(until.urlParams().orderId);
    let submitObj = {
        orderId: order.orderId
    };
    console.log(order);
    until.renderTem('client_userInfo', 'client_userInfo_tem', {
        order
    });

    console.log(uploadTypes);

    function createObjectURL(object) {
        return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
    }
    $('input[type="file"]').not('.file').on('change', function(e) {
        let oldInput = $(this).parent().prevAll('input');
        let img = $(this).parent().prevAll('img');
        let key = oldInput.attr('id');

        uploaders[key].bind('FilesAdded', function(uploader, files) {
            let file = files[0];
            let postfix = /.+\.(jpg|png|gif)$/.exec(file);
            if (postfix == undefined || postfix == null) {
                postfix = ".jpg";
            }
            submitObj[key] = `dev/${until.getItem('providerId')}_${order.orderId}_${key}${postfix}`;
            console.log(submitObj);
        });
    });
    $('.file').on('change', function(e) {
        console.log(11)
        let file = e.target.files[0];
        let postfix = /\.[^\.]+$/.exec(file.name);
        if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
            alert('这个不是图片哟,重新上传吧');
            return;
        }
        console.log(postfix);
        let dataUrl = window.URL.createObjectURL(file);


        console.log(`图片的URL${dataUrl}`)

        let key = $(this).attr('id');
        $(this).prev().attr('src', dataUrl);
        uploaders[key].addFile(file);

        // uploadTypes['upload' + key](uploaders[key]);
        // console.log(`dev/${until.getItem('mobile')}${alias[key]}${postfix[0]}`, '添加上传名称');
        submitObj[key] = `dev/${until.getItem('providerId')}_${order.orderId}_${key}${postfix}`;


    });
    $('.action-button').on('click', async function() {
        if (until.isEmpty($('#carMileage').val().trim())) {
            alert('里程不能为空');
            return;
        }
        $('.select-tab').find('input').each(function(index, item) {
            /**
             * false 正常  1
             * true  异常   2
             */
            submitObj[item.id] = item.checked ? 2 : 1
        });

        for (let key in uploaders) {
            uploadTypes['upload' + key](uploaders[key], `${until.getItem('providerId')}_${order.orderId}`)
        }

        let data = await server_finish(submitObj);
        if (data.success) {
            jumpPage('上传成功', 'index')
        }
    })


})