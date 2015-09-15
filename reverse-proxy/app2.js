var express = require('express'),
    gzippo = require('gzippo'),
    app = express();

app.use(gzippo.staticGzip('public'));
app.use(gzippo.compress());

app.get('/', function (req, res) {
    res.send('hello world..!!, i am from express on port 3001');
});
console.log('static server started 3001');

app.listen('3001');