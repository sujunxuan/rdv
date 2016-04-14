var express = require('express');
var Redis = require('ioredis');
//var co = require('co');

var db = require(__base + 'core/db');
var business = require(__base + 'core/business');

var router = express.Router();
var redis = new Redis(32769, '192.168.99.100');


/* GET home page. */
router.get('/', function (req, res, next) {
    if (!global.isLogin) {
        res.redirect('/users/login');
        return;
    }

    var orderKey = 'rdv:orders',
        userKey = 'rdv:users',
        commodityKey = 'rdv:commodity';
    var model = {};

    //从缓存中查询订单数据
    redis.smembers(orderKey).then(function (orders) {
        if (orders && orders.length)
            return orders;

        //从DB中查询订单数据
        return db.order.find().exec().then(function (orders) {
            //设置缓存
            if (orders) {
                //redis.sadd(orderKey, orders);
                //redis.expire(orderKey, 600);
            }
            return orders;
        });
    }).then(function (orders) {
        //计算订单相关指标
        model.sales = business.getSales(orders);
        model.sevenDaySales = business.get7daySales(orders);
        model.citySales = business.getCitySales(orders);
        model.orderCount = business.getOrderCount(orders);
        model.price = business.getPrice(model.sales, model.orderCount);

        //从缓存中查询用户数据
        return redis.smembers(userKey);
    }).then(function (users) {
        if (users && users.length)
            return users;

        //从DB中查询用户数据
        return db.user.find().exec().then(function (users) {
            //设置缓存
            if (users) {
                //redis.sadd(userKey, users);
                //redis.expire(userKey, 600);
            }
            return users;
        });
    }).then(function (users) {
        //计算用户相关指标
        model.userCount = business.getUser(users);

        //从缓存中查询商品数据
        return redis.smembers(commodityKey);
    }).then(function (commodity) {
        if (commodity && commodity.length)
            return commodity;

        //从DB中查询商品数据
        return db.commodity.find().exec().then(function (commodity) {
            //设置缓存
            if (commodity) {
                //redis.sadd(commodityKey, commodity);
                //redis.expire(commodityKey, 600);
            }
            return commodity;
        });
    }).then(function (commodity) {
        //计算商品相关指标
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
    //if (!global.isLogin) {
    //    res.redirect('/users/login');
    //    return;
    //}

    var orderKey = 'rdv:orders',
        commodityKey = 'rdv:commodity';
    var model = {};

    //从缓存中查询订单数据
    redis.smembers(orderKey).then(function (orders) {
        if (orders && orders.length)
            return orders;

        //从DB中查询订单数据
        return db.order.find().exec().then(function (orders) {
            //设置缓存
            if (orders) {
                //redis.sadd(orderKey, orders);
                //redis.expire(orderKey, 600);
            }
            return orders;
        });
    }).then(function (orders) {
        model.orders = orders;

        //从缓存中查询商品数据
        return redis.smembers(commodityKey);
    }).then(function (commodity) {
        if (commodity && commodity.length)
            return commodity;

        //从DB中查询商品数据
        return db.commodity.find().exec().then(function (commodity) {
            //设置缓存
            if (commodity) {
                //redis.sadd(commodityKey, commodity);
                //redis.expire(commodityKey, 600);
            }
            return commodity;
        });
    }).then(function (commodity) {
        //计算品类相关指标
        var list = business.getCategoryData(model.orders, commodity);

        res.render('category', {list: list});
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

router.get('/test', function (req, res, next) {
    db.order.find(function (err, order) {
        if (order.from === 'app') {
            res.send("ok");
        }
        else {
            res.send('no');
        }
    })
});

module.exports = router;
