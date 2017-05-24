var path = require('path')
var ROOT = path.resolve(__dirname);

module.exports = {
    client: {
        'client/login': {
            "src": ROOT + "/src/client/login",
            "tpl": "login.html"
        },
        'client/register': {
            "src": ROOT + '/src/client/register',
            "tpl": "register.html"
        },
        'client/index': {
            "src": ROOT + '/src/client/index',
            "tpl": "index.html"
        }
    }
}