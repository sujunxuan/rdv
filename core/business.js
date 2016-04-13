var moment = require('moment');
var Enumerable = require('linq');

var business = {

    //获取销售额
    getSales: function (orders) {
        if (!orders || !orders.length)
            return {
                total: 0,
                app: 0
            };

        var totalSales = 0,
            appSales = 0;

        orders.forEach(function (order) {
            totalSales += order.total;
            if (order.from === "app") {
                appSales += order.total;
            }
        });

        return {
            total: totalSales,
            app: appSales
        };
    },

    //获取UV
    getUV: function (commoditys) {
        if (!commoditys || !commoditys.length)
            return {
                total: 0,
                app: 0
            };

        var totalUV = 0,
            appUV = 0;

        commoditys.forEach(function (commodity) {
            totalUV += commodity.uv;
            appUV += commodity.app_uv;
        });

        return {
            total: totalUV,
            app: appUV
        };
    },

    //获取转化率
    getRate: function (uv, count) {
        //if (!uv || !count)
        //    return {
        //        total: 0,
        //        app: 0
        //    };
        //
        //return {
        //    total: count.total / (uv.total || 1),
        //    app: count.app / (uv.app || 1)
        //};

            return {
                total: 4.89,
                app: 5.78
            };
    },

    //获取订单数
    getOrderCount: function (orders) {
        if (!orders || !orders.length)
            return {
                total: 0,
                app: 0
            };

        var appCount = 0;
        orders.forEach(function (order) {
            if (order.from === "app") {
                appCount += 1;
            }
        });

        return {
            total: orders.length,
            app: appCount
        };
    },

    //获取客单价
    getPrice: function (sales, count) {
        if (!sales || !count)
            return {
                total: 0,
                app: 0
            };

        return {
            total: (sales.total / (count.total || 1)).toFixed(2),
            app: (sales.app / (count.app || 1)).toFixed(2)
        };
    },

    //获取用户数
    getUser: function (users) {
        if (!users || !users.length)
            return {
                total: 0,
                app: 0,
                new: 0,
                newApp: 0
            };

        var newCount = 0,
            appCount = 0,
            appNewCount = 0;

        users.forEach(function (user) {
            if (user.tag === "001") {
                newCount += 1;
            }

            if (user.from === "app") {
                appCount += 1;
                if (user.tag === "001") {
                    appNewCount += 1;
                }
            }
        });

        return {
            total: users.length,
            app: appCount,
            new: newCount,
            newApp: appNewCount
        };
    },

    //获取实时UV
    getRealTimeUV: function () {

        return {
            time: moment().format('mm:ss'),
            uv: between(20000, 40000)
        }
    },

    //获取最近七天销售额
    get7daySales: function (orders) {
        //if (!orders || !orders.length)
        //    return [];
        //
        //var data = Enumerable.from(orders)
        //    .where(function (o) {
        //        return o.createTime.getDate() + 7 > new Date().getDate()
        //    })
        //    .groupBy(function (o) {
        //        return o.createTime.getDate();
        //    })
        //    .select(function (g) {
        //        return {
        //            day: g.key,
        //            sales: g.sum(function (o) {
        //                return o.total;
        //            })
        //        }
        //    }).toArray();
        //
        //return data;

        return [
            {day: "4-12", sales: between(10000000, 25000000)},
            {day: "4-13", sales: between(10000000, 25000000)},
            {day: "4-14", sales: between(10000000, 25000000)},
            {day: "4-15", sales: between(10000000, 25000000)},
            {day: "4-16", sales: between(10000000, 25000000)},
            {day: "4-17", sales: between(10000000, 25000000)},
            {day: "4-18", sales: between(10000000, 25000000)}
        ]
    },

    //获取各个城市销售额
    getCitySales: function (orders) {
        //if (!orders || !orders.length)
        //    return [];
        //
        //var data = Enumerable.from(orders)
        //    .groupBy(function (o) {
        //        return o.city;
        //    })
        //    .select(function (g) {
        //        return {
        //            day: g.key,
        //            sales: g.sum(function (o) {
        //                return o.total;
        //            })
        //        }
        //    }).toArray();
        //
        //return data;

        return [
            {city: "上海", val: between(10000000, 25000000)},
            {city: "北京", val: between(10000000, 25000000)},
            {city: "深圳", val: between(10000000, 25000000)},
            {city: "广州", val: between(10000000, 25000000)},
            {city: "杭州", val: between(10000000, 25000000)},
            {city: "南京", val: between(10000000, 25000000)}
        ]
    },

    //获取品类分析数据
    getCategoryData: function (types,orders) {

    },

    //获取用户分析数据
    getCustomerData: function () {

    }
};

function between(randNumMin, randNumMax) {
    var randInt = Math.floor((Math.random() * ((randNumMax + 1) - randNumMin)) + randNumMin);
    return randInt;
}

module.exports = business;