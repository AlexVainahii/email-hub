const { imapSchema } = require("./imapSchema");
const { editImapSchema } = require("./editImapSchema");
const { itemPerPageSchema } = require("./itemPerPageSchema");
const { sendSchema } = require("./sendSchema");
const { moveEmailsSchema } = require("./moveEmailsSchema");
const { deleteEmailsSchema } = require("./deleteEmailsSchema");
const { flagsEmailsSchema } = require("./flagsEmailsSchema");
module.exports = {
  imapSchema,
  itemPerPageSchema,
  editImapSchema,
  sendSchema,
  moveEmailsSchema,
  deleteEmailsSchema,
  flagsEmailsSchema,
};
