const { EmailService } = require("@services");
const helpers = require("@helpers");
const addBox = async (req, res) => {
  const { _id: owner } = req.user;
  const { email, password, port, host, tls } = req.body;
  helpers.CheckByError(
    !email || !password || !port || !host || !tls,
    400,
    "Email or password or port or host or tls not found!"
  );
  const newEmailBox = await EmailService.addMailBox({ owner, ...req.body });

  res.status(201).json({ data: newEmailBox, status: 201 });
};

module.exports = { addBox };
