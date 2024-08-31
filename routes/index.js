var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', { title: process.env.APP_NAME });
});


router.get('/test', async function (req, res, next) {
    const currentDateTime = new Date();
    return res.json({
      'name': process.env.APP_NAME,
      'datetime': `${currentDateTime.getFullYear()}-${currentDateTime.getMonth()}-${currentDateTime.getDate()} ${currentDateTime.getHours()}:${currentDateTime.getMinutes()}:${currentDateTime.getSeconds()}`,
      'timestamp': Date.now()
    });
});

module.exports = router;
