require('dotenv').config();
var express = require("express");
var router = express.Router();
// const { PollResponse } = require("../models");

// get poll
router.put("/:id", (req, res) => {
  try {
    let pollResponse = {
      id: req.poll_uuid
    }
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;
