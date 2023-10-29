const { EmailService } = require("@services");
const helpers = require("@helpers");
const addBox = async (req, res) => {
  const { _id: owner, itemPerPage } = req.user;
  const { email, pass, port, host, secure } = req.body;
  helpers.CheckByError(
    !email || !pass || !port || !host || !secure,
    400,
    "Email or password or port or host or secure not found!"
  );
  const newEmailBox = await EmailService.addMailBox(
    { owner, ...req.body },
    itemPerPage
  );

  res.status(201).json({ data: newEmailBox, status: 201 });
};

module.exports = { addBox };
