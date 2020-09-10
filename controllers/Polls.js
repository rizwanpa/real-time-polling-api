const { Polls } = require('../models');

const createPoll = async (req, res) => {
  try {
    let request = req.body
    let httpStatusCode;

    /* Validations */
    if(!("title" in request)) {
      httpStatusCode = 400;
    }
    
    //check status

    // res.status(httpStatusCode);
    /* switch (httpStatusCode) {
      case 200:
        res.send("success");
      break;
      case 400:
        res.send("Invalid Request");
      break;
    } */

    const poll = await Polls.create(request);
    return res.status(201).json({
      poll
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}



module.exports = {
  createPoll
}