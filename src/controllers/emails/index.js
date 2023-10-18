const expressAsyncHandler = require("express-async-handler");

const { getEmails } = require("./getEmails");

module.exports = {
  getEmails: expressAsyncHandler(getEmails),
};
