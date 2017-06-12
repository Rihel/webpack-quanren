import "../scss/server.scss";
import "../scss/font.scss";
import './menu_toggle';


import until from '../modules/until';
import tem from '../modules/template-web';
import {
    server_OrderDetail,
    server_finish
} from '../api/api';
import {
    alert,
    jumpPage
} from '../modules/dialog';
import {
    uploadImages,
    uploadTypes,
    alias
} from '../modules/uploadOssAll';

let uploaders = {
    carMileageUrl: uploadImages($('#carMileageUrl')[0], null, 'carMileageUrl'),
    carAcceptedUrl: uploadImages($('#carAcceptedUrl')[0], null, 'carAcceptedUrl'),
    carMxpjdUrl: uploadImages($('#carMxpjdUrl')[0], null, 'carMxpjdUrl'),
}

tem.defaults.imports.washServiceLabel = OrderData => {
    return until.GetOrderServiceLabel(OrderData)
}
console.log(uploaders)
$(async function () {
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

    $('.file').on('change', function (e) {
        let file = e.target.files[0];
        let postfix = /\.[^\.]+$/.exec(file.name);
        if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
            alert('这个不是图片哟,重新上传吧');
            return;
        }
        let dataUrl = window.URL.createObjectURL(file);
        let key = $(this).attr('uploadType');
        $(this).prev().attr('src', dataUrl);
        uploaders[key].addFile(file);
        submitObj[key] = `dev/${until.getItem('providerId')}_${order.orderId}_${key}${postfix}`;
        console.log(submitObj)
    });
    $('input[id^="html5"]').on('change', function (e) {
        let key = $(this).parent().prevAll('.file').attr('uploadType');
        let file = uploaders[key].files[0];
        let postfix = /\.[^\.]+$/.exec(file.name);
        if (!/\.(png|gif|jpg|svg)/i.test(postfix[0])) {
            alert('这个不是图片哟,重新上传吧');
            return;
        }
        submitObj[key] = `dev/${until.getItem('providerId')}_${order.orderId}_${key}${postfix}`;
        console.log(submitObj)
    })


    $('.action-button').on('click', async function () {
        if (until.isEmpty($('#carMileage').val().trim())) {
            alert('里程不能为空');
            return;
        }
        $('.select-tab').find('input').each(function (index, item) {
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