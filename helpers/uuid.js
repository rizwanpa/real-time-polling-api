const { Polls } = require("../models");

async function generateUuid(len) {
  let buf = [],
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    charlen = chars.length,
    length = len || 32;

  for (var i = 0; i < length; i++) {
    buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
  }
  let uuid = buf.join("");

  let polls = await Polls.findAll({
    where: {
      uuid: uuid
    }
  });

  if(polls.length) {
    generateUuid(len);
  } else {
    return uuid;
  }
}

module.exports =  {generateUuid};
