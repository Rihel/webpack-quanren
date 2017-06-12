import '../scss/server.scss';
import '../scss/font.scss';
import './menu_toggle';

import {
    server_myInfo
} from '../api/api.js';
import until from '../modules/until';


$(async function() {
    let { providerInfo } = await server_myInfo();
    until.renderTem('userInfo', 'userInfo-tem', {
        providerInfo
    })
})