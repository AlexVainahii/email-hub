const express = require("express");
require("module-alias/register");
const middleW = require("@middlewares");
const { schemas } = require("@schemas");
const { emailsCtrl } = require("@controllers");

const router = express.Router();
router.get("/", middleW.authenticate, emailsCtrl.getAllBox);
router.get(
  "/getEmailsFromBox",
  middleW.authenticate,
  emailsCtrl.getEmailsFromBox
);
router.get(
  "/getNewEmailsFromBox",
  middleW.authenticate,
  emailsCtrl.getNewEmailsFromBox
);
router.get(
  "/getEmailsFromSearch",
  middleW.authenticate,
  emailsCtrl.getEmailsFromSearch
);
router.get("/getMailOne/:id", middleW.authenticate, emailsCtrl.getMailOne);
router.post(
  "/addBoxImap",
  middleW.authenticate,
  middleW.validateBody(schemas.imapSchema),
  emailsCtrl.addBoxImap
);
router.patch(
  "/perPage",
  middleW.authenticate,
  middleW.validateBody(schemas.itemPerPageSchema),
  emailsCtrl.patchPerPage
);
router.post(
  "/sendMail",
  middleW.authenticate,
  middleW.validateBody(schemas.sendSchema),
  emailsCtrl.sendMail
);
router.patch(
  "/:id",
  middleW.isValidId,
  middleW.authenticate,
  middleW.validateBody(schemas.editImapSchema),
  emailsCtrl.editBoxImap
);
router.put(
  "/move",
  middleW.authenticate,
  middleW.validateBody(schemas.moveEmailsSchema),
  emailsCtrl.moveEmails
);
router.put(
  "/flags",
  middleW.authenticate,
  middleW.validateBody(schemas.flagsEmailsSchema),
  emailsCtrl.flagsEmails
);

router.delete(
  "/delete",
  middleW.authenticate,
  middleW.validateBody(schemas.deleteEmailsSchema),
  emailsCtrl.deleteEmails
);
router.delete(
  "/:id",
  middleW.isValidId,
  middleW.authenticate,
  emailsCtrl.deleteBoxImap
);

module.exports = router;
