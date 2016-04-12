/**
 * Created by sujunxuan on 2016/4/11.
 */
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
        if (!uv || !count)
            return {
                total: 0,
                app: 0
            };

        return {
            total: count.total / (uv.total || 1),
            app: count.app / (uv.app || 1)
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
            total: sales.total / (count.total || 1),
            app: sales.app / (count.app || 1)
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
    }
};

module.exports = business;