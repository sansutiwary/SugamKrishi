const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    return res.end("<h1>About Main Page</h1>");
});

router.get('/owner',function(req,res){
    return res.end("<h1>About Owner Page</h1>");
});

module.exports = router;