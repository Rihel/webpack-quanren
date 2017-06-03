import '../scss/common.scss';
import '../scss/font.scss';
import '../scss/wechat_pay.scss';

import {
    client_wxbingd,
    client_unifiedorder
} from '../api/api';
import until from '../modules/until';
import { dialog, alert } from '../modules/dialog';

console.log(until.isWechat());
$(async function() {
    let block = $('.block'),
        sure = $('.sure'),
        don1 = $('.don1');
    if (until.isWechat()) {
        $('.noWechatBrowser').hide();
        don1.show();
        let wxbingd = await client_wxbingd();
        // alert(wxbingd);
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
                alert('111');
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest',
                    JSON.parse(payReqData), //json串
                    function(res) {
                        WeixinJSBridge.log(res.err_msg);
                        console.log(res);
                        if (res.err_msg == "get_brand_wcpay_request:ok") { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。 
                            dialog({
                                title: '提示',
                                content: '您已支付成功!',
                                btns: ['确定'],
                                btnsCallbcak: btns => {
                                    $(btns).click(e => {
                                        until.jumpPage('wait_pay');
                                    })
                                }
                            }); //支付成功 	

                        } else {
                            alert('支付失败, 请检查网络, 稍后再试。');

                        }
                    }
                );
            })
        });

    } else {


    }
})