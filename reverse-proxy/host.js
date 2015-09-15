var http = require('http');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxy();

var opt = {
    "localhost:9000": "http://127.0.0.1:3000",
    "static.localhost:9000": "http://127.0.0.1:3001",
    "images.localhost:9000": "http://127.0.0.1:3002"
};

var app = http.createServer(function (req, res) {
    console.log(req.headers.host);
    console.log(opt[req.headers.host] + req.url);


    proxy.web(req, res, {
        target: opt[req.headers.host]
    });
});
console.log('proxy server started 9000');
app.listen(9000);