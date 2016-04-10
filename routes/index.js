var express = require('express');
var Redis = require('ioredis');
var db = require(__base + 'core/db');

var redis = new Redis(32769, '192.168.99.100');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Real-time data visual system'});
});

router.get('/order', function (req, res, next) {
    db.order.find(function (err, orders) {
        if (err) return console.error(err);
        res.send(orders);
    })
});

module.exports = router;
