const expressAsyncHandler = require("express-async-handler");

const { getEmails } = require("./getEmails");
const { getEmailBox } = require("./getEmailBox");
const { addBoxImap } = require("./addBoxImap");
const { patchPerPage } = require("./patchPerPage");
const { getAllBox } = require("./getAllBox");
module.exports = {
  getEmails: expressAsyncHandler(getEmails),
  getEmailBox: expressAsyncHandler(getEmailBox),
  addBoxImap: expressAsyncHandler(addBoxImap),
  patchPerPage: expressAsyncHandler(patchPerPage),
  getAllBox: expressAsyncHandler(getAllBox),
};
