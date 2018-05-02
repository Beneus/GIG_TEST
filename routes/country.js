var express = require('express');
var router = express.Router();
var countries = require('country-list')();

router.get('/country-list', function(req, res,next) {
    res.send(countries.getData());
});

router.get('/country-name/:Code', function(req, res,next) {
    res.send(countries.getName(req.params.Code));
});

module.exports = router;