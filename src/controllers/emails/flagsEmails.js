const { EmailService } = require("@services");
const helpers = require("@helpers");

const flagsEmails = async (req, res) => {
  const { mailList } = req.body;
  helpers.CheckByError(mailList.length === 0, 400, "mailList is empty");

  const listFlags = await EmailService.flagsMails({ ...req.body });
  console.log("answer :>> ", listFlags);
  res.status(200).json({ listFlags, status: 200 });
};

module.exports = { flagsEmails };
