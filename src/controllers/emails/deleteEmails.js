const { EmailService } = require("@services");
const helpers = require("@helpers");

const deleteEmails = async (req, res) => {
  const { mailList } = req.body;
  helpers.CheckByError(mailList.length === 0, 400, "mailLis is empty");

  const listDelete = await EmailService.deleteMails({ ...req.body });
  console.log("answer :>> ", listDelete);
  res.status(200).json({ listDelete, status: 200 });
};

module.exports = { deleteEmails };
