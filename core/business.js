var moment = require('moment');
var Enumerable = require('linq');

var business = {

    /**
     * 获取销售额
     * @param orders
     * @returns {{total: number, app: number}}
     */
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

    /***
     * 获取UV
     * @param commoditys
     * @returns {{total: number, app: number}}
     */
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

    /***
     * 获取转化率
     * @param uv
     * @param count
     * @returns {{total: number, app: number}}
     */
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

    /***
     * 获取订单数
     * @param orders
     * @returns {{total: number, app: number}}
     */
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

    /***
     * 获取客单价
     * @param sales
     * @param count
     * @returns {{total: number, app: number}}
     */
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

    /***
     * 获取用户数
     * @param users
     * @returns {{total: number, app: number}}
     */
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
            if (user.tag === "新客人群") {
                newCount += 1;
            }

            if (user.from === "app") {
                appCount += 1;
                if (user.tag === "新客人群") {
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

    /***
     * 获取实时UV
     * @returns {{time: string, uv: number}}
     */
    getRealTimeUV: function () {

        return {
            time: moment().format('mm:ss'),
            uv: between(20000, 40000)
        }
    },

    /***
     * 获取最近七天销售额
     * @param orders
     * @returns {*}
     */
    get7daySales: function (orders) {
        if (!orders || !orders.length)
            return [];

        return Enumerable.from(orders)
            .where(function (o) {
                var now = new Date();
                o.createTime = new Date(o.createTime);
                return new Date(o.createTime.getFullYear(), o.createTime.getMonth(), o.createTime.getDate() + 7)
                    > new Date(now.getFullYear(), now.getMonth(), now.getDate());
            })
            .groupBy(function (o) {
                return moment(o.createTime).format('M-D');
            })
            .select(function (g) {
                return {
                    day: g.key(),
                    sales: g.sum(function (o) {
                        return o.total;
                    })
                }
            })
            .orderBy(function (d) {
                return new Date(d.day);
            })
            .toArray();
    },

    /***
     * 获取各个城市销售额
     * @param orders
     * @returns {*}
     */
    getCitySales: function (orders) {
        if (!orders || !orders.length)
            return [];

        return Enumerable.from(orders)
            .groupBy(function (o) {
                return o.city;
            })
            .select(function (g) {
                return {
                    city: g.key(),
                    sales: g.sum(function (o) {
                        return o.total;
                    })
                }
            })
            .toArray();
    },

    /***
     * 获取品类分析数据
     * @param orders
     * @param commoditys
     * @returns {*}
     */
    getCategoryData: function (orders, commoditys) {
        if (!orders || !orders.length || !commoditys || !commoditys.length)
            return [];

        var uvs = Enumerable.from(commoditys)
            .groupBy(function (c) {
                return c.type;
            })
            .select(function (g) {
                return {
                    name: g.key(),
                    uv: g.sum(function (c) {
                        return c.uv;
                    })
                }
            });

        return Enumerable.from(orders)
            .groupBy(function (o) {
                return o.ctype;
            })
            .select(function (g) {
                return {
                    name: g.key(),
                    sales: g.sum(function (o) {
                        return o.total;
                    }),
                    app: g.where(function (o) {
                        return o.from === "app";
                    }).sum(function (o) {
                        return o.total;
                    }),
                    order: g.count(),
                    user: g.distinct(function (o) {
                        return o.uid;
                    }).count(),
                    new: g.count(function (o) {
                        return o.new === 'true';
                    }),
                    uv: uvs.where(function (u) {
                        return u.name === g.key();
                    }).sum(function (u) {
                        return u.uv;
                    })
                }
            })
            .toArray();
    },

    /***
     * 获取用户分析数据
     * @param users
     * @param orders
     * @returns {*}
     */
    getCustomerData: function (users, orders) {
        if (!users || !users.length || !orders || !orders.length)
            return [];

        var orders = Enumerable.from(orders);
        return Enumerable.from(users)
            .groupBy(function (u) {
                return u.tag;
            })
            .select(function (g) {
                var tagOrders = orders.where(function (o) {
                    return o.utag === g.key();
                });

                return {
                    name: g.key(),
                    user: g.count(),
                    order: tagOrders.count(),
                    sales: tagOrders.sum(function (o) {
                        return o.total;
                    })
                }
            })
            .toArray();
    }
};

/***
 * 生成随机数
 * @param randNumMin
 * @param randNumMax
 * @returns {number}
 */
function between(randNumMin, randNumMax) {
    var randInt = Math.floor((Math.random() * ((randNumMax + 1) - randNumMin)) + randNumMin);
    return randInt;
}

module.exports = business;