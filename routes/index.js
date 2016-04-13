var express = require('express');
var Redis = require('ioredis');
//var co = require('co');

var db = require(__base + 'core/db');
var business = require(__base + 'core/business');

var router = express.Router();
var redis = new Redis(32769, '192.168.99.100');


/* GET home page. */
router.get('/', function (req, res, next) {
    if (!global.isLogin)
        res.redirect('/users/login');

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
                redis.sadd(orderKey, orders);
                redis.expire(orderKey, 600);
            }
            return orders;
        });
    }).then(function (orders) {
        model.sales = business.getSales(orders);
        model.sevenDaySales = business.get7daySales(orders);
        model.citySales = business.getCitySales(orders);
        model.orderCount = business.getOrderCount(orders);
        model.price = business.getPrice(model.sales, model.orderCount);

        return redis.get(userKey);
    }).then(function (users) {
        if (users)
            return users;
        return db.user.find().exec().then(function (users) {
            if (users) {
                redis.sadd(userKey, users);
                redis.expire(userKey, 600);
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
                redis.sadd(commodityKey, commodity);
                redis.expire(commodityKey, 600);
            }
            return commodity;
        });
    }).then(function (commodity) {
        model.uv = business.getUV(commodity);
        model.rate = business.getRate(model.uv, model.orderCount);
        model.commodity = {
            count: commodity.length,
            type: 12
        };

        res.render('index', model);
    });

});

router.get('/category', function (req, res, next) {
    if (!global.isLogin)
        res.redirect('/users/login');

    res.render('category', {
        list: [
            {name: "女装", sales: 10000000},
            {name: "男装", sales: 10000000},
            {name: "体用", sales: 10000000},
            {name: "居家", sales: 10000000},
            {name: "美妆", sales: 10000000},
            {name: "海淘", sales: 10000000},
            {name: "食品", sales: 10000000},
            {name: "母婴", sales: 10000000},
            {name: "数码", sales: 10000000},
            {name: "珠宝", sales: 10000000},
            {name: "图书", sales: 10000000},
            {name: "汽车", sales: 10000000}
        ]
    });
});

router.get('/customer', function (req, res, next) {
    if (!global.isLogin)
        res.redirect('/users/login');

    res.render('customer', {
        list: [
            {name: "主流人群", sales: 15000000},
            {name: "70s女士", sales: 20000000},
            {name: "90s丽人", sales: 23000000},
            {name: "男士人群", sales: 32000000},
            {name: "新客人群", sales: 19000000}
        ]
    });
});

module.exports = router;
