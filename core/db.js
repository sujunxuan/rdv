/**
 * Created by Silent on 2016/4/9.
 */
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://192.168.99.100:32768/rdv');
var Schema = mongoose.Schema;

var commodity = new Schema({
    id: String,
    name: String,
    price: Number,
    type: String,
    uv: Number,
    app_uv: Number
});

var user = new Schema({
    id: String,
    name: String,
    sex: String,
    age: Number,
    tag: String,
    from: String
});

var order = new Schema({
    id: String,
    cid: String,
    uid: String,
    count: Number,
    total: Number,
    new: String,
    from: String,
    city: String,
    ctype: String,
    createTime: Date
});

var uv = new Schema({
    uid: String,
    cid: String,
    from: String,
    count: Number,
    createTime: Date
});

var commodity_type = new Schema({
    id: String,
    name: String
});

var user_tag = new Schema({
    id: String,
    name: String
});

module.exports = {
    user: db.model('user', user, 'users'),
    commodity: db.model('commodity', commodity, 'commoditys'),
    order: db.model('order', order, 'orders'),
    uv: db.model('uv', uv, 'uv'),
    commodity_type: db.model('commodity_type', commodity_type, 'commodity_types'),
    user_tag: db.model('user_tag', user_tag, 'user_tags')
};

