var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
    
    res.sendFile('./index.html', { root: './'});
});

router.get('/test', function(req, res) {
    
    res.sendFile('./test/index.html', { root: './'});
});
module.exports = router;
