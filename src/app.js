import "./index.scss";

import {user_Status} from './api/api';
 
// // console.log(api);

(async() => {
    // let data = await api.login(13533797833,123);
    // console.log(data);
    let status=await user_Status(13533797833);
    console.log(status);
})();