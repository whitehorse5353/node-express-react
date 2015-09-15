var express = require('express'),
    router = param = express.Router();
var sub = express.Router({mergeParams: true});

var defaultRoute = function (req, res) {
    res.render('defaultView');
};

var params = function (req, res) {
    res.render('sample', {name: req.params.username});
};

var subRouter = function (req, res) {
    res.render('sampleSubRoute', {data: {username: req.params.username, item: req.params.item}});
};

router.get('/', defaultRoute);

param.get('/user/:username', params);

param.use('/user/:username', sub);

sub.get('/item/:item', subRouter);


module.exports = router;