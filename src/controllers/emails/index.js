const expressAsyncHandler = require("express-async-handler");

const { getEmailsFromBox } = require("./getEmailsFromBox");
const { getEmailsFromSearch } = require("./getEmailsFromSearch");
const { getEmailBox } = require("./getEmailBox");
const { addBoxImap } = require("./addBoxImap");
const { patchPerPage } = require("./patchPerPage");
const { getAllBox } = require("./getAllBox");
const { editBoxImap } = require("./editBoxImap");
const { deleteBoxImap } = require("./deleteBoxImap");
const { getMailOne } = require("./getMailOne");
const { sendMail } = require("./sendMail");
module.exports = {
  getEmailsFromBox: expressAsyncHandler(getEmailsFromBox),
  getEmailsFromSearch: expressAsyncHandler(getEmailsFromSearch),
  getEmailBox: expressAsyncHandler(getEmailBox),
  addBoxImap: expressAsyncHandler(addBoxImap),
  patchPerPage: expressAsyncHandler(patchPerPage),
  getAllBox: expressAsyncHandler(getAllBox),
  editBoxImap: expressAsyncHandler(editBoxImap),
  deleteBoxImap: expressAsyncHandler(deleteBoxImap),
  getMailOne: expressAsyncHandler(getMailOne),
  sendMail: expressAsyncHandler(sendMail),
};
