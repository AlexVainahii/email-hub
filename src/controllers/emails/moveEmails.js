const { EmailService } = require("@services");
const helpers = require("@helpers");

const moveEmails = async (req, res) => {
  const { fromPath, toPath, mailList } = req.body;
  helpers.CheckByError(fromPath === toPath, 400, "fromPath===toPath,");
  helpers.CheckByError(mailList.length === 0, 400, "mailLis is empty");

  const listMove = await EmailService.moveMails({ ...req.body });
  console.log("answer :>> ", listMove);
  res.status(200).json({ listMove, status: 200 });
};

module.exports = { moveEmails };
