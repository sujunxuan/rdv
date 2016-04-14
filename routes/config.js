var express = require('express');
var Mock = require('mockjs')

var db = require(__base + 'core/db');

var router = express.Router();

router.get('/', function (req, res, next) {
    var Random = Mock.Random;

    Random.extend({
        location: function () {
            var citys = ['上海', '上海', '上海', '北京', '广州', '深圳', '杭州', '南京'];
            return this.pick(citys)
        },
        category: function () {
            var categorys = ['女装', '女装', '女装', '女装', '男装', '体育', '居家', '美妆', '海淘', '食品', '母婴', '数码', '珠宝', '图书', '汽车'];
            return this.pick(categorys)
        },
        tag: function () {
            var tags = ['90s丽人', '90s丽人', '90s丽人', '主流人群', '70s女士', '男士人群', '新客人群'];
            return this.pick(tags);
        },
        from: function () {
            var froms = ['app', 'app', 'app', 'web', 'pc', 'wap', 'wx'];
            return this.pick(froms);
        },
        createTime: function () {
            var now = new Date();
            var start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return new Date(this.integer(start.getTime(), now.getTime()));
        }
    });

    setInterval(function () {
        var or = new db.order();
        or.id = Random.date('yyyyMMddhhmmssSS');
        or.cid = Random.natural(1, 100);
        or.uid = Random.natural(1, 100);
        or.count = Random.natural(1, 5);
        or.total = Random.natural(10, 10000);
        or.new = Random.boolean();
        or.from = Random.from();
        or.city = Random.location();
        or.ctype = Random.category();
        or.createTime = Random.createTime();

        or.save();
    }, 100);

    setInterval(function () {
        var u = new db.user();
        u.id = Random.date('yyyyMMddhhmmssSS');
        u.name = Random.name();
        u.sex = Random.natural(1, 2);
        u.age = Random.natural(1, 90);
        u.tag = Random.tag();
        u.from = Random.from();

        u.save();
    }, 200);

    setInterval(function () {
        var c = new db.commodity();
        c.id = Random.date('yyyyMMddhhmmssSS');
        c.name = Random.cword(3, 10);
        c.price = Random.natural(1, 10000);
        c.type = Random.category();
        c.uv = Random.natural(100, 1000000);
        c.app_uv = Random.natural(100, 1000000);

        c.save();
    }, 600);

    res.send('ok');
});


module.exports = router;