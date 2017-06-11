import '../scss/common.scss';
import '../scss/font.scss';
import '../scss/wechat_pay.scss';

import {
    client_wxbingd,
    client_unifiedorder
} from '../api/api';
import until from '../modules/until';
import { dialog, alert, jumpPage } from '../modules/dialog';


$(async function() {
    let block = $('.block'),
        sure = $('.sure'),
        don1 = $('.don1');
    if (until.isWechat()) {
        $('.noWechatBrowser').hide();
        don1.show();
        let wxbingd = await client_wxbingd();
        if (wxbingd.success) {
            don1.on('click', async function() {
                $(this).hide();
                block.show();
                let {
                    clientMobile,
                    clientName,
                    vipTitle,
                    packageFee,
                    premiumFee,
                    payReqData
                } = await client_unifiedorder();
                console.log(premiumFee, packageFee)
                until.renderTem('warpper', 'wechat_pay_userinfo', {
                    clientMobile,
                    clientName,
                    vipTitle,
                    packageFee,
                    premiumFee: premiumFee !== undefined ? premiumFee : 0,
                });
                sure.on('click', function() {

                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        JSON.parse(payReqData), //json串
                        function(res) {
                            WeixinJSBridge.log(res.err_msg);
                            console.log(res);
                            if (res.err_msg == "get_brand_wcpay_request:ok") { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。 

                                jumpPage('您已支付成功!', 'wait_pay');
                            } else {
                                jumpPage('支付失败, 请检查网络, 稍后再试。', 'login');

                            }
                        }
                    );
                })
            });

        } else {
            console.log('开始跳转')
            until.jumpPage(wxbingd.data);
        }




    } else {


    }
})