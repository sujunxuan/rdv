var express = require('express');
var Redis = require('ioredis');
var db = require(__base + 'core/db');
var business = require(__base + 'core/business');

var redis = new Redis(32769, '192.168.99.100');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        sales: {
            total: 231517956,
            app: 231517956
        },
        uv: {
            total: 781517865,
            app: 5315178656
        },
        rate: {
            total: 4.83,
            app: 5.21
        },
        orderCount: {
            total: 14215,
            app: 11215
        },
        price: {
            total: 261,
            app: 271
        },
        userCount: {
            total: 4832261,
            app: 3832261,
            new: 58357,
            newApp: 38357
        }
    });
});

router.get('/order', function (req, res, next) {
    var key = 'rdv:orders';

    redis.get(key, function (err, result) {
        if (err || !result) {
            db.order.find(function (err, orders) {
                if (err)
                    res.send(500);

                //set cache
                redis.set(key, orders);
                redis.expire(key, 600);

                res.send(orders);
            })
        }
        else {
            res.send(result);
        }
    });

});


module.exports = router;
