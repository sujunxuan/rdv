var express = require('express');
var Redis = require('ioredis');
var co = require('co');

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

    var modelKey = 'rdv:model:index',
        orderKey = 'rdv:orders',
        userKey = 'rdv:users',
        commodityKey = 'rdv:commodity';
    var model = {};

    redis.get(modelKey, function (err, cache) {
        if (cache) {
            res.render('index', JSON.parse(cache));
            return;
        }

        //从缓存中查询订单数据
        redis.get(orderKey).then(function (orders) {
                if (orders && orders.length)
                    return JSON.parse(orders);

                //从DB中查询订单数据
                return db.order.find().exec().then(function (orders) {
                    //设置缓存
                    if (orders) {
                        redis.set(orderKey, JSON.stringify(orders));
                        redis.expire(orderKey, 60);
                    }
                    return orders;
                });
            })
            .then(function (orders) {
                //计算订单相关指标
                model.sales = business.getSales(orders);
                model.sevenDaySales = business.get7daySales(orders);
                model.citySales = business.getCitySales(orders);
                model.orderCount = business.getOrderCount(orders);
                model.price = business.getPrice(model.sales, model.orderCount);

                //从缓存中查询用户数据
                return redis.get(userKey);
            })
            .then(function (users) {
                if (users && users.length)
                    return JSON.parse(users);

                //从DB中查询用户数据
                return db.user.find().exec().then(function (users) {
                    //设置缓存
                    if (users) {
                        redis.set(userKey, JSON.stringify(users));
                        redis.expire(userKey, 60);
                    }
                    return users;
                });
            })
            .then(function (users) {
                //计算用户相关指标
                model.userCount = business.getUser(users);

                //从缓存中查询商品数据
                return redis.get(commodityKey);
            })
            .then(function (commodity) {
                if (commodity && commodity.length)
                    return JSON.parse(commodity);

                //从DB中查询商品数据
                return db.commodity.find().exec().then(function (commodity) {
                    //设置缓存
                    if (commodity) {
                        redis.set(commodityKey, JSON.stringify(commodity));
                        redis.expire(commodityKey, 60);
                    }
                    return commodity;
                });
            })
            .then(function (commodity) {
                //计算商品相关指标
                model.uv = business.getUV(commodity);
                model.rate = business.getRate(model.uv, model.orderCount);
                model.commodity = {
                    count: commodity.length,
                    type: 12
                };

                redis.set(modelKey, JSON.stringify(model));
                redis.expire(modelKey, 100);

                res.render('index', model);
            });
    });

});

router.get('/category', function (req, res, next) {
    if (!global.isLogin) {
        res.redirect('/users/login');
        return;
    }

    var modelKey = 'rdv:model:category',
        orderKey = 'rdv:orders',
        commodityKey = 'rdv:commodity';
    var model = {};

    redis.get(modelKey, function (err, cache) {
        if (cache) {
            res.render('category', {list: JSON.parse(cache)});
            return;
        }

        //从缓存中查询订单数据
        redis.get(orderKey).then(function (orders) {
                if (orders && orders.length)
                    return JSON.parse(orders);

                //从DB中查询订单数据
                return db.order.find().exec().then(function (orders) {
                    //设置缓存
                    if (orders) {
                        redis.set(orderKey, JSON.stringify(orders));
                        redis.expire(orderKey, 60);
                    }
                    return orders;
                });
            })
            .then(function (orders) {
                model.orders = orders;

                //从缓存中查询商品数据
                return redis.get(commodityKey);
            })
            .then(function (commodity) {
                if (commodity && commodity.length)
                    return JSON.parse(commodity);

                //从DB中查询商品数据
                return db.commodity.find().exec().then(function (commodity) {
                    //设置缓存
                    if (commodity) {
                        redis.set(commodityKey, JSON.stringify(commodity));
                        redis.expire(commodityKey, 60);
                    }
                    return commodity;
                });
            })
            .then(function (commodity) {
                //计算品类相关指标
                var list = business.getCategoryData(model.orders, commodity);

                if (list && list.length) {
                    redis.set(modelKey, JSON.stringify(list));
                    redis.expire(modelKey, 100);
                }

                res.render('category', {list: list});
            });
    });

});

router.get('/customer', function (req, res, next) {
    if (!global.isLogin) {
        res.redirect('/users/login');
        return;
    }

    var modelKey = "rdv:model:customer",
        orderKey = 'rdv:orders',
        userKey = 'rdv:users';
    var model = {};

    redis.get(modelKey, function (err, cache) {
        if (cache) {
            res.render('customer', {list: JSON.parse(cache)});
            return;
        }

        //从缓存中查询订单数据
        redis.get(orderKey).then(function (orders) {
                if (orders && orders.length)
                    return JSON.parse(orders);

                //从DB中查询订单数据
                return db.order.find().exec().then(function (orders) {
                    //设置缓存
                    if (orders) {
                        redis.set(orderKey, JSON.stringify(orders));
                        redis.expire(orderKey, 60);
                    }
                    return orders;
                });
            })
            .then(function (orders) {
                model.orders = orders;

                //从缓存中查询商品数据
                return redis.get(userKey);
            })
            .then(function (users) {
                if (users && users.length)
                    return JSON.parse(users);

                //从DB中查询商品数据
                return db.user.find().exec().then(function (users) {
                    //设置缓存
                    if (users) {
                        redis.set(userKey, JSON.stringify(users));
                        redis.expire(userKey, 60);
                    }
                    return users;
                });
            })
            .then(function (users) {
                //计算人群相关指标
                var list = business.getCustomerData(users, model.orders);

                if (list && list.length) {
                    redis.set(modelKey, JSON.stringify(list));
                    redis.expire(modelKey, 100);
                }

                res.render('customer', {list: list});
            });
    });
});

router.get('/customer2', function (req, res, next) {

    var modelKey = "rdv:model:customer",
        orderKey = 'rdv:orders',
        userKey = 'rdv:users';

    //use co
    co(function *() {
        var list = yield redis.get(modelKey);
        if (list) {
            res.render('customer', {list: JSON.parse(list)});
            return;
        }

        //查询订单数据
        var orders = yield redis.get(orderKey);
        if (orders)
            orders = JSON.parse(orders);
        else {
            orders = yield db.order.find().exec();

            //设置缓存
            if (orders) {
                redis.set(orderKey, JSON.stringify(orders));
                redis.expire(orderKey, 60);
            }
        }

        //查询用户数据
        var users = yield redis.get(userKey);
        if (users) {
            users = JSON.parse(users);
        }
        else {
            users = yield db.user.find().exec();
            //设置缓存
            if (users) {
                redis.set(userKey, JSON.stringify(users));
                redis.expire(userKey, 60);
            }
        }

        //计算人群相关指标
        list = business.getCustomerData(users, orders);

        if (list && list.length) {
            redis.set(modelKey, JSON.stringify(list));
            redis.expire(modelKey, 100);
        }

        res.render('customer', {list: list});
    });
});

module.exports = router;
