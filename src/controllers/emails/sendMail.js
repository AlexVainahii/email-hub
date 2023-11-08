const { EmailService } = require("@services");
const helpers = require("@helpers");

const sendMail = async (req, res) => {
  const { _id: owner } = req.user;
  const { recipient } = req.body;
  helpers.CheckByError(!recipient, 400, "Email not found!");
  const answer = await EmailService.sendMailNew({ owner, ...req.body });
  console.log("answer :>> ", answer);
  res.status(201).json({ answer, status: 201 });
};

module.exports = { sendMail };
