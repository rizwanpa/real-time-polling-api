var express = require('express');
var router = express.Router();
/* GET home page. */
// router.get('/', function(req, res, next) {
//   // res.render('index', { title: 'Express' });
//   res.json({ title: 'Express' });
// });

// module.exports = router;



//router.js
module.exports = (getIOInstance) => {
  router.get('/', function(req, res, next) {
    getIOInstance().sockets.emit('first-message', { someProperty: 'some value', otherProperty: 'other value' });
    res.json({ title: 'Express' });
  });
  return router;
};