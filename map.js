var path = require('path')
var ROOT = path.resolve(__dirname);

module.exports = {
    client: {
        'login': {
            "src": ROOT + "/src/client/login",
            "tpl": "login.html"
        },
        'register': {
            "src": ROOT + '/src/client/register',
            "tpl": "register.html"
        },
        'index': {
            "src": ROOT + '/src/client/index',
            "tpl": "index.html"
        }
    }
}