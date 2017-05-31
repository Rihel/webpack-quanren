import '../scss/server.scss';
import '../scss/font.scss';

import './menu_toggle';

import {
    server_myInfo,
    server_osummary,
    server_ysummary
} from '../api/api';


// (async() => {
//     let myInfo = await server_myInfo();
//     let ysummary = await server_ysummary();
//     let osummary = await server_osummary();

//     console.log(myInfo, ysummary, osummary)
// })()