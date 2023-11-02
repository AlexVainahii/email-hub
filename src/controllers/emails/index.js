const expressAsyncHandler = require("express-async-handler");

const { getEmailsFromBox } = require("./getEmailsFromBox");
const { getEmailBox } = require("./getEmailBox");
const { addBoxImap } = require("./addBoxImap");
const { patchPerPage } = require("./patchPerPage");
const { getAllBox } = require("./getAllBox");
const { editBoxImap } = require("./editBoxImap");
const { deleteBoxImap } = require("./deleteBoxImap");
const { getMailOne } = require("./getMailOne");
module.exports = {
  getEmailsFromBox: expressAsyncHandler(getEmailsFromBox),
  getEmailBox: expressAsyncHandler(getEmailBox),
  addBoxImap: expressAsyncHandler(addBoxImap),
  patchPerPage: expressAsyncHandler(patchPerPage),
  getAllBox: expressAsyncHandler(getAllBox),
  editBoxImap: expressAsyncHandler(editBoxImap),
  deleteBoxImap: expressAsyncHandler(deleteBoxImap),
  getMailOne: expressAsyncHandler(getMailOne),
};
