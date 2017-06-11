import '../scss/common.scss';
import '../scss/font.scss';
import '../scss/client.scss';

import until from '../modules/until';
import {
    uploadImages,
    alias,
    uploadTypes
} from '../modules/uploadOssAll';

import {
    client_userGet
} from '../api/api';



$(async function() {
    let userInfo = await client_userGet();
    let { name, mobile } = userInfo.data;
    $('#name').val(name);
    $('#phone').val(mobile);
})