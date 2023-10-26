const expressAsyncHandler = require("express-async-handler");

const { getEmails } = require("./getEmails");
const { getEmailBox } = require("./getEmailBox");
const { addBox } = require("./addBox");
const { patchPerPage } = require("./patchPerPage");
const { getAllBox } = require("./getAllBox");
module.exports = {
  getEmails: expressAsyncHandler(getEmails),
  getEmailBox: expressAsyncHandler(getEmailBox),
  addBox: expressAsyncHandler(addBox),
  patchPerPage: expressAsyncHandler(patchPerPage),
  getAllBox: expressAsyncHandler(getAllBox),
};
