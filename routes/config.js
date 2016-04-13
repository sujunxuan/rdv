var express = require('express');
var Mock = require('mockjs')

var db = require(__base + 'core/db');

var router = express.Router();

router.get('/', function (req, res, next) {
    var Random=Mock.Random;

    setInterval(function () {
        var or = new db.order();
        or.id = Random.date('yyyyMMddhhmmssSS');
        or.cid = Random.natural(1, 100);
        or.uid = Random.natural(1, 100);
        or.count = Random.natural(1, 5);
        or.total = Random.natural(10, 10000);
        or.new = Random.boolean();
        or.from = 'app';
        or.city = Random.city();
        or.ctype = '食品';
        or.createTime = new Date();

        or.save();
    }, 100);

    setInterval(function () {
        var u = new db.user();
        u.id = Random.date('yyyyMMddhhmmssSS');
        u.name = Random.name();
        u.sex = Random.natural(1, 2);
        u.age = Random.natural(1, 90);
        u.tag = '70s女士';
        u.from = 'app';

        u.save();
    }, 100);

    setInterval(function () {
        var c = new db.commodity();
        c.id = Random.date('yyyyMMddhhmmssSS');
        c.name = Random.word();
        c.price = Random.natural(1, 10000);
        c.type = '食品';
        c.uv = Random.natural(100, 1000000);
        c.app_uv = Random.natural(100, 1000000);

        c.save();
    }, 100);

    res.send('ok');
});

module.exports = router;