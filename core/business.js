/**
 * Created by sujunxuan on 2016/4/11.
 */
var business = {

    //获取销售额
    getSales: function (orders) {
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
        var totalUV = 0,
            appUV = 0;

        //Todo app uv
        commoditys.forEach(function (commodity) {
            totalUV += commodity.uv;
            appUV += commodity.uv;
        });

        return {
            total: totalUV,
            app: appUV
        };
    },

    //获取转化率
    getRate: function (uv, count) {
        return {
            total: count.total / uv.total,
            app: count.app / uv.app
        };
    },

    //获取订单数
    getOrderCount: function (orders) {
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
        return {
            total: sales.total / count.total,
            app: sales.app / count.app
        };
    },

    //获取用户数
    getUser: function (users) {
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