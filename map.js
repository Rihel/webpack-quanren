const path = require('path')
const ROOT = path.resolve(__dirname);

module.exports = {
    client: {
        'client_login': {
            "src": ROOT + "/src/client/client_login",
            "tpl": "login.html"
        },
        'client_register': {
            "src": ROOT + '/src/client/client_register',
            "tpl": "register.html"
        },
        'client_index': {
            "src": ROOT + '/src/client/client_index',
            "tpl": "index.html"
        }
    },
    server: {
        'server_login': {
            'src': ROOT + '/src/server/server_login',
            "tpl": "login.html"
        },
        'server_index': {
            'src': ROOT + '/src/server/server_index',
            "tpl": "index.html"
        },
        'server_orderList': {
            'src': ROOT + '/src/server/server_orderList',
            "tpl": "orderList.html"
        },
        'server_serverList': {
            'src': ROOT + '/src/server/server_serverList',
            "tpl": "serverList.html"
        },
        'server_userInfo': {
            'src': ROOT + '/src/server/server_userInfo',
            "tpl": "userInfo.html"
        },
        'server_upload': {
            'src': ROOT + '/src/server/server_upload',
            "tpl": "upload.html"
        }
    }
}