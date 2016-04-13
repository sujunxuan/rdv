var express = require('express');
var Redis = require('ioredis');
//var co = require('co');
var db = require(__base + 'core/db');
var business = require(__base + 'core/business');

var redis = new Redis(32769, '192.168.99.100');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if(!global.isLogin)
        res.redirect('/users/login')

    var orderKey = 'rdv:orders',
        userKey = 'rdv:users',
        commodityKey = 'rdv:commodity';
    var model = {};

    redis.get(orderKey).then(function (orders) {
        if (orders)
            return orders;
        return db.order.find().exec().then(function (orders) {
            //设置缓存
            if (orders) {
                //redis.set(orderKey, orders);
                //redis.expire(orderKey, 600);
            }
            return orders;
        });
    }).then(function (orders) {
        model.sales = business.getSales(orders);
        model.orderCount = business.getOrderCount(orders);
        model.price = business.getPrice(model.sales, model.orderCount);

        return redis.get(userKey);
    }).then(function (users) {
        if (users)
            return users;
        return db.user.find().exec().then(function (users) {
            if (users) {
                //redis.set(userKey, users);
                //redis.expire(userKey, 600);
            }
            return users;
        });
    }).then(function (users) {
        model.userCount = business.getUser(users);

        return redis.get(commodityKey);
    }).then(function (commodity) {
        if (commodity)
            return commodity;
        return db.commodity.find().exec().then(function (commodity) {
            if (commodity) {
                //redis.set(commodityKey, commodity);
                //redis.expire(commodityKey, 600);
            }
            return commodity;
        });
    }).then(function (commodity) {
        model.uv = business.getUV(commodity);
        model.rate = business.getRate(model.uv, model.orderCount);

        res.render('index', model);
    });

});

router.get('/uv', function (req, res, next) {
    if(!global.isLogin)
        res.redirect('/users/login')

    res.send("uv data")
});

router.get('/category', function (req, res, next) {
    if(!global.isLogin)
        res.redirect('/users/login')

    res.render('category', {});
});

router.get('/customer', function (req, res, next) {
    if(!global.isLogin)
        res.redirect('/users/login')

    res.render('customer', {});
});

module.exports = router;
