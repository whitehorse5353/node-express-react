var express = require('express'),
    app = express(),
    routes = require('./routes');

app.use(routes);
app.set('views', './views');
app.set('view engine', 'ejs');
console.log('proxy server started 3000');

app.listen('3000');