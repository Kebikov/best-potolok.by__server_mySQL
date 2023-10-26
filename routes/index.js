const express = require('express');
const router = express.Router({mergeParams: true});


router.use('/admin', require('./admin.routes')); 
router.use('/auth', require('./auth.routes')); 
router.use('/management', require('./management.routes'));


module.exports = router;  

