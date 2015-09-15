var express = require('express'),
    app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('i am a image server');
});

console.log('i am a image server');

app.listen('3002');