var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  //res.send('respond with a resource');
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ userId: 1,username:'Rizwan',email:'rizwan@ansari.com' }));
});

module.exports = router;
