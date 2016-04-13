var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    if (req.body.username === 'admin' && req.body.passwd === '123456') {
        global.isLogin = true;
        res.send({accessGranted: true});
        return;
    }
    res.send({accessGranted: false});
});

module.exports = router;
