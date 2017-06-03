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
    let { providerId } = await server_myInfo();
    until.setItem('providerId', providerId);

    let {
        unconfirmNum,
        confirmedNum,
        forServiceNum,
        forPriceSheepNum,
        lockedNum,
    } = await server_ysummary();
    let {
        servicingNum
    } = await server_osummary();
    until.renderTem('ysummary', 'ysummary-tem', {
        unconfirmNum,
        confirmedNum,
        forServiceNum,
        forPriceSheepNum,
        lockedNum,
        servicingNum
    })


})()