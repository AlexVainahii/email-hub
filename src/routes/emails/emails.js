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
  "/getEmailsFromSearch",
  middleW.authenticate,
  emailsCtrl.getEmailsFromSearch
);
router.get("/getBox", emailsCtrl.getEmailBox);
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

router.patch(
  "/:id",
  middleW.isValidId,
  middleW.authenticate,
  middleW.validateBody(schemas.editImapSchema),
  emailsCtrl.editBoxImap
);

router.delete(
  "/:id",
  middleW.isValidId,
  middleW.authenticate,
  emailsCtrl.deleteBoxImap
);
// router.post(
//   "/login",
//   middleW.validateBody(schemas.loginSchema),
//   usersCtrl.logIn
// );

// router.get("/current", middleW.authenticate, usersCtrl.getCurrent);

// router.patch(
//   "/user",
//   middleW.authenticate,
//   middleW.uploadAvatar.single("avatar"),
//   middleW.validateUpdateBody(schemas.updateSchema),
//   usersCtrl.updateUser
// );

// router.post("/logout", middleW.authenticate, usersCtrl.logOut);

// router.get("/verify/:verificationToken", usersCtrl.verifyEmail);

// router.get("/sendVerifyEmail", middleW.authenticate, usersCtrl.sendVerifyEmail);

// router.post(
//   "/sendRenewPass",
//   middleW.validateBody(schemas.emailSchema),
//   usersCtrl.sendRenewPassword
// );
// router.post(
//   "/changePassword",
//   middleW.authenticate,
//   middleW.validateBody(schemas.passSchema),
//   usersCtrl.changePassword
// );

module.exports = router;
