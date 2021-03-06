const path = require('path')
const ROOT = path.resolve(__dirname);

let clientPages = ['login', 'userCenter',
    'register', 'index', 'wechat_pay', 'wait_pay','urgency'
];
let serverPages = ['login', 'orderList', 'userInfo', 'serverList', 'upload', 'index'];
let client = {};
let server = {};
for (let key of clientPages) {
    client[`client_${key}`] = {
        src: `${ROOT}/src/client/client_${key}`,
        tpl: `${key}.html`
    };

}
for (let key of serverPages) {
    server[`server_${key}`] = {
        src: `${ROOT}/src/server/server_${key}`,
        tpl: `${key}.html`
    };

}


module.exports = {
    client: client,
    server: server
}