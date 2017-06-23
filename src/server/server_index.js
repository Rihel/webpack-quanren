import '../scss/server.scss';
import '../scss/font.scss';

import './menu_toggle';

import {
    server_myInfo,
    server_osummary,
    server_ysummary
} from '../api/api';
import until from '../modules/until';


(async() => {
    let { providerId ,providerInfo} = await server_myInfo();
    until.setItem('providerId', providerId);

    let ysummary = await server_ysummary();
    console.log(ysummary);
    let osummary= await server_osummary();
    until.renderTem('init', 'init-tem', {
        unconfirmNum:ysummary.unconfirmNum||0,
        confirmedNum:ysummary.confirmedNum||0,
        forServiceNum:ysummary.forServiceNum||0,
        forPriceSheepNum:ysummary.forPriceSheepNum||0,
        lockedNum:ysummary.lockedNum||0,
        servicingNum:osummary.servicingNum||0,
        submittedNum:osummary.submittedNum||0,
        providerInfo:providerInfo||0
    })


})()