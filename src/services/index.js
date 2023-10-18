const { getToken } = require("./getToken");
const sendEmail = require("./sendEmail");
const UserService = require("./UserService");
const EmailService = require("./EmailService");
module.exports = {
  sendEmail,
  getToken,
  UserService,
  EmailService,
};
