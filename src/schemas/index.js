const {
  registerSchema,
  emailSchema,
  loginSchema,
  updateSchema,
  passSchema,
} = require("./authSchemas");

const {
  getMonthTasksSchema,
  patchTaskSchema,
  postTaskSchema,
  getFakeTaskSchema,
} = require("./taskSchemas");
const { postReviewSchema, patchReviewSchema } = require("./reviewSchemas");
const {
  imapSchema,
  itemPerPageSchema,
  editImapSchema,
  sendSchema,
} = require("./imapSchemas");
const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  updateSchema,
  passSchema,
  getMonthTasksSchema,
  patchTaskSchema,
  postTaskSchema,
  postReviewSchema,
  patchReviewSchema,
  getFakeTaskSchema,
  imapSchema,
  itemPerPageSchema,
  editImapSchema,
  sendSchema,
};

module.exports = { schemas };
