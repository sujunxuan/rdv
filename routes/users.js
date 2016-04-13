var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    res.send({accessGranted: req.body.username === 'admin' && req.body.passwd === '123456'});
});

module.exports = router;
